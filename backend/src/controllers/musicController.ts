import { Request, Response } from 'express';
import { generateMusicPrompt } from '../services/musicPromptService';
import { generateMusic } from '../services/geminiMusicService';
import { convertWAVtoMP3, encodeToBase64, estimateDuration, generateSilentAudio } from '../services/audioService';
import { PoetOption, MusicResponse, ErrorResponse } from '../types';
import { config } from '../config';

export const generateMusicFromImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('=== Music generation request received ===');

  try {
    const { imageData, poetStyle } = req.body;

    // 입력 검증
    if (!imageData) {
      res.status(400).json({
        error: 'Image data is required'
      } as ErrorResponse);
      return;
    }

    const validStyles: PoetOption[] = ['A', 'B', 'C', 'D'];
    const style: PoetOption = validStyles.includes(poetStyle) ? poetStyle : 'A';

    // Vertex AI 설정 확인
    if (!config.vertexAI.projectId) {
      console.error('Vertex AI project not configured');
      res.status(500).json({
        error: 'Music generation service is not configured. Set GOOGLE_CLOUD_PROJECT.'
      } as ErrorResponse);
      return;
    }

    console.log('Poet style:', style);
    console.log('Image data length:', imageData.length);

    // 1. GPT로 음악 프롬프트 생성
    console.log('Step 1: Generating music prompt...');
    const musicPrompt = await generateMusicPrompt(imageData, style);

    // 2. Vertex AI Lyria로 음악 생성
    console.log('Step 2: Generating music with Vertex AI Lyria...');
    let wavBuffer: Buffer;

    try {
      wavBuffer = await generateMusic(musicPrompt, style);
    } catch (error) {
      console.error('Vertex AI music generation failed:', error);
      // 폴백: 무음 오디오 생성
      console.log('Falling back to silent audio...');
      const silentMp3 = await generateSilentAudio(config.vertexAI.musicDuration);

      if (silentMp3.length === 0) {
        res.status(500).json({
          error: 'Music generation failed',
          details: 'Vertex AI Lyria API is not available and fallback failed'
        } as ErrorResponse);
        return;
      }

      res.json({
        audioData: encodeToBase64(silentMp3),
        duration: config.vertexAI.musicDuration,
        prompt: musicPrompt
      } as MusicResponse);
      return;
    }

    // 3. WAV를 MP3로 변환
    console.log('Step 3: Converting WAV to MP3...');
    let mp3Buffer: Buffer;

    if (wavBuffer.length === 0) {
      // API가 빈 응답을 반환한 경우
      console.log('No WAV data, generating silent audio...');
      mp3Buffer = await generateSilentAudio(config.vertexAI.musicDuration);
    } else {
      mp3Buffer = await convertWAVtoMP3(wavBuffer);
    }

    // 4. Base64 인코딩
    console.log('Step 4: Encoding to Base64...');
    const audioData = encodeToBase64(mp3Buffer);
    const duration = estimateDuration(mp3Buffer) || config.vertexAI.musicDuration;

    console.log('Music generation completed successfully');
    console.log('Audio data length:', audioData.length);
    console.log('Duration:', duration, 'seconds');

    res.json({
      audioData,
      duration,
      prompt: musicPrompt
    } as MusicResponse);

  } catch (error) {
    console.error('Music generation error:', error);
    res.status(500).json({
      error: 'Failed to generate music',
      details: error instanceof Error ? error.message : 'Unknown error'
    } as ErrorResponse);
  }
};
