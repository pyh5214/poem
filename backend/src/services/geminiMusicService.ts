import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { config } from '../config';
import { PoetOption } from '../types';
import { musicStyleMappings } from '../config/musicPrompts';

/**
 * Vertex AI Lyria API를 사용하여 음악을 생성합니다.
 *
 * @see https://cloud.google.com/vertex-ai/generative-ai/docs/music/generate-music
 */
export const generateMusic = async (
  prompt: string,
  poetStyle: PoetOption
): Promise<Buffer> => {
  const style = musicStyleMappings[poetStyle];

  // 프롬프트에 스타일 정보 추가
  const enhancedPrompt = `${prompt} Style: ${style.genre}, ${style.mood}. Instruments: ${style.instruments.join(', ')}.`;

  console.log('Starting Vertex AI Lyria music generation...');
  console.log('Prompt:', enhancedPrompt);

  try {
    // Google Cloud 인증
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const accessToken = await auth.getAccessToken();

    if (!accessToken) {
      throw new Error('Failed to obtain Google Cloud access token');
    }

    const { projectId, location, model } = config.vertexAI;

    // Vertex AI Lyria API 엔드포인트
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;

    console.log('Calling Vertex AI endpoint:', endpoint);

    const response = await axios.post(
      endpoint,
      {
        instances: [{
          prompt: enhancedPrompt,
        }],
        parameters: {
          sampleCount: 1,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: config.vertexAI.timeout,
      }
    );

    // 응답에서 오디오 데이터 추출
    const predictions = response.data.predictions;

    if (!predictions || predictions.length === 0) {
      console.error('No predictions in response');
      return Buffer.alloc(0);
    }

    // Base64 인코딩된 WAV 데이터 디코딩
    const audioBase64 = predictions[0].audioContent || predictions[0].bytesBase64Encoded;

    if (!audioBase64) {
      console.error('No audio content in response');
      return Buffer.alloc(0);
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    console.log('Music generation completed, buffer size:', audioBuffer.length);

    return audioBuffer;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Vertex AI API error:', error.response?.status, error.response?.data);

      // 403/401 에러: 인증 또는 권한 문제
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Google Cloud authentication failed. Ensure GOOGLE_APPLICATION_CREDENTIALS is set.');
      }

      // 404 에러: 모델 또는 프로젝트 문제
      if (error.response?.status === 404) {
        throw new Error('Lyria model not found. Check project ID and ensure Vertex AI API is enabled.');
      }
    }

    console.error('Failed to generate music:', error);
    throw error;
  }
};

/**
 * WAV 오디오 스펙 정보
 * Vertex AI Lyria는 48kHz WAV 출력 (32.8초)
 */
export const getAudioSpec = () => ({
  sampleRate: 48000,
  format: 'wav',
  durationSeconds: 32.8,
});
