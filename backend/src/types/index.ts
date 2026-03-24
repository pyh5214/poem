export type PoetOption = 'A' | 'B' | 'C' | 'D';

export interface PoetPrompt {
  [key: string]: string;
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface PoemRequest {
  option: PoetOption;
}

export interface PoemResponse {
  poem: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface HealthResponse {
  status: string;
  message: string;
  apiKeySet: boolean;
  geminiKeySet?: boolean;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | OpenAIContentPart[];
}

export interface OpenAIContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface OpenAIChoice {
  message: {
    content: string;
  };
}

export interface OpenAIResponse {
  choices: OpenAIChoice[];
}

// Music generation types
export interface MusicRequest {
  imageData: string;
  poetStyle: PoetOption;
}

export interface MusicResponse {
  audioData: string; // base64 encoded MP3
  duration: number;
  prompt: string;
}

export interface MusicGenerationConfig {
  bpm: number;
  brightness: number;
  density: number;
  guidance: number;
  temperature: number;
}

// Postcard (saved poem + music + image)
export interface Postcard {
  id: string;
  title: string | null;
  poem: string;
  poetStyle: PoetOption;
  musicPrompt: string | null;
  imagePath: string | null;
  audioPath: string | null;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
}

// DB row format (snake_case)
export interface PostcardRow {
  id: string;
  title: string | null;
  poem: string;
  poet_style: string;
  music_prompt: string | null;
  image_path: string | null;
  audio_path: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePostcardRequest {
  poem: string;
  title?: string;
  poetStyle: PoetOption;
  musicPrompt?: string;
  imageData?: string;  // base64
  audioData?: string;  // base64
  duration?: number;
}

export interface PostcardListResponse {
  items: Postcard[];
  total: number;
  page: number;
  limit: number;
}

// 통합 엽서 생성 요청 (이미지 → 시 → 음악 → 저장)
export interface CreateFullPostcardRequest {
  imageData: string;  // base64 data URL
  poetStyle: PoetOption;
}

// 통합 엽서 생성 응답
export interface CreateFullPostcardResponse {
  postcard: Postcard;
  poem: string;
  audioData: string;  // base64
}
