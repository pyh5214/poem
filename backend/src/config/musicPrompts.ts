import { PoetOption } from '../types';

export interface MusicStyleMapping {
  genre: string;
  mood: string;
  instruments: string[];
  bpm: number;
  brightness: number;
  density: number;
}

export const musicStyleMappings: Record<PoetOption, MusicStyleMapping> = {
  'A': {
    // 서정적 스타일 - 어쿠스틱 팝 발라드, 카페 BGM
    genre: 'acoustic pop ballad, soft cafe music',
    mood: 'warm, heartfelt, romantic, soothing',
    instruments: ['acoustic guitar', 'piano', 'soft strings', 'light percussion'],
    bpm: 75,
    brightness: 0.7,
    density: 0.5
  },
  'B': {
    // 이미지즘 스타일 - 시네마틱 팝, K-드라마 OST
    genre: 'cinematic pop, emotional K-drama OST style',
    mood: 'beautiful, emotional, dreamy, touching',
    instruments: ['piano', 'orchestral strings', 'soft synth pads', 'celesta'],
    bpm: 70,
    brightness: 0.6,
    density: 0.5
  },
  'C': {
    // 모더니즘 스타일 - 일렉트로닉 팝, 신스웨이브
    genre: 'electronic pop, synthwave, modern atmospheric',
    mood: 'mysterious, cool, sophisticated, moody',
    instruments: ['synthesizers', 'electronic beats', 'bass synth', 'ambient pads'],
    bpm: 100,
    brightness: 0.5,
    density: 0.6
  },
  'D': {
    // SNS 스타일 - 업비트 팝, 바이럴 댄스 BGM
    genre: 'upbeat pop, dance pop, viral TikTok music, energetic EDM pop',
    mood: 'exciting, fun, energetic, playful, cheerful',
    instruments: ['punchy drums', 'synth bass', 'bright synths', 'claps', 'uplifting chords'],
    bpm: 120,
    brightness: 0.85,
    density: 0.75
  }
};

export const generateMusicPromptInstruction = (poetStyle: PoetOption): string => {
  const style = musicStyleMappings[poetStyle];

  return `Based on this image, create a music prompt for generating popular background music (BGM).
The music should be commercial, easy-listening, and suitable for video content or advertisements.

Style guidelines:
- Genre: ${style.genre}
- Mood: ${style.mood}
- Instruments: ${style.instruments.join(', ')}
- BPM: around ${style.bpm}

Analyze the image and describe the perfect BGM in 2-3 sentences.
Focus on creating a catchy, pleasant melody that complements the visual atmosphere.
The music should feel polished and professionally produced, like a YouTube BGM or cafe playlist.
Output only the music description, nothing else.`;
};
