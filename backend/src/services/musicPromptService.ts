import axios from 'axios';
import { config } from '../config';
import { PoetOption } from '../types';
import { generateMusicPromptInstruction, musicStyleMappings } from '../config/musicPrompts';

/**
 * GPT API를 사용하여 이미지 기반 음악 프롬프트를 생성합니다.
 */
export const generateMusicPrompt = async (
  imageDataUrl: string,
  poetStyle: PoetOption
): Promise<string> => {
  const instruction = generateMusicPromptInstruction(poetStyle);
  const style = musicStyleMappings[poetStyle];

  try {
    console.log('Generating music prompt for style:', poetStyle);

    const response = await axios.post(
      config.openai.apiUrl,
      {
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: instruction
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageDataUrl
                }
              },
              {
                type: 'text',
                text: 'Describe the perfect background music for this image.'
              }
            ]
          }
        ],
        max_tokens: 200,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: config.openai.timeout,
      }
    );

    const musicDescription = response.data.choices[0]?.message?.content?.trim() || '';

    // 스타일 정보와 결합하여 최종 프롬프트 생성
    const finalPrompt = `${style.genre}, ${style.mood}. ${musicDescription}. Instruments: ${style.instruments.join(', ')}`;

    console.log('Generated music prompt:', finalPrompt);
    return finalPrompt;
  } catch (error) {
    console.error('Error generating music prompt:', error);
    // 폴백: 기본 프롬프트 반환
    return `${style.genre}, ${style.mood}. ${style.instruments.join(', ')}`;
  }
};
