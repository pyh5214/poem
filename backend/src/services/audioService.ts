import ffmpeg from 'fluent-ffmpeg';
import { Readable, PassThrough } from 'stream';

/**
 * WAV 버퍼를 MP3로 변환합니다.
 * FFmpeg가 없으면 WAV를 그대로 반환합니다.
 */
export const convertWAVtoMP3 = async (wavBuffer: Buffer): Promise<Buffer> => {
  if (wavBuffer.length === 0) {
    console.log('Empty WAV buffer, returning empty');
    return Buffer.alloc(0);
  }

  return new Promise((resolve) => {
    const chunks: Buffer[] = [];

    const inputStream = new Readable();
    inputStream.push(wavBuffer);
    inputStream.push(null);

    const outputStream = new PassThrough();

    outputStream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    outputStream.on('end', () => {
      const mp3Buffer = Buffer.concat(chunks);
      console.log('MP3 conversion completed, size:', mp3Buffer.length);
      resolve(mp3Buffer);
    });

    outputStream.on('error', () => {
      // FFmpeg 실패시 WAV 그대로 반환
      console.log('FFmpeg not available, returning WAV directly');
      resolve(wavBuffer);
    });

    // FFmpeg 변환 시도
    ffmpeg(inputStream)
      .inputFormat('wav')
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .format('mp3')
      .on('error', () => {
        // FFmpeg 에러시 WAV 그대로 반환
        console.log('FFmpeg conversion failed, returning WAV directly');
        resolve(wavBuffer);
      })
      .on('end', () => {
        console.log('FFmpeg processing finished');
      })
      .pipe(outputStream, { end: true });
  });
};

/**
 * PCM 버퍼를 MP3로 변환합니다 (레거시 호환성).
 */
export const convertPCMtoMP3 = async (pcmBuffer: Buffer): Promise<Buffer> => {
  if (pcmBuffer.length === 0) {
    console.log('Empty PCM buffer, returning empty MP3');
    return Buffer.alloc(0);
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const inputStream = new Readable();
    inputStream.push(pcmBuffer);
    inputStream.push(null);

    const outputStream = new PassThrough();

    outputStream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    outputStream.on('end', () => {
      const mp3Buffer = Buffer.concat(chunks);
      console.log('MP3 conversion completed, size:', mp3Buffer.length);
      resolve(mp3Buffer);
    });

    outputStream.on('error', (error) => {
      console.error('Output stream error:', error);
      reject(error);
    });

    // FFmpeg 변환 (PCM -> MP3, 48kHz stereo 16bit)
    ffmpeg(inputStream)
      .inputFormat('s16le')
      .inputOptions(['-ar 48000', '-ac 2'])
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .format('mp3')
      .on('error', (error) => {
        console.error('FFmpeg conversion error:', error);
        reject(error);
      })
      .on('end', () => {
        console.log('FFmpeg processing finished');
      })
      .pipe(outputStream, { end: true });
  });
};

/**
 * 오디오 버퍼를 Base64로 인코딩합니다.
 */
export const encodeToBase64 = (buffer: Buffer): string => {
  return buffer.toString('base64');
};

/**
 * MP3 데이터의 대략적인 재생 시간을 계산합니다 (초).
 * 128kbps 기준
 */
export const estimateDuration = (mp3Buffer: Buffer): number => {
  const bitrate = 128000; // 128kbps in bits
  const bytes = mp3Buffer.length;
  const bits = bytes * 8;
  const seconds = bits / bitrate;
  return Math.round(seconds);
};

/**
 * 더미 오디오 생성 (API 불가 시 폴백)
 */
export const generateSilentAudio = async (durationSeconds: number): Promise<Buffer> => {
  try {
    return await generateSilentAudioWithFFmpeg(durationSeconds);
  } catch (error) {
    console.log('FFmpeg not available, using pure JS WAV generation');
    return generateSilentWAV(durationSeconds);
  }
};

/**
 * FFmpeg로 무음 MP3 생성
 */
const generateSilentAudioWithFFmpeg = (durationSeconds: number): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const outputStream = new PassThrough();

    outputStream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    outputStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    outputStream.on('error', reject);

    ffmpeg()
      .input('anullsrc=r=44100:cl=stereo')
      .inputFormat('lavfi')
      .duration(durationSeconds)
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .format('mp3')
      .on('error', (error) => {
        console.error('FFmpeg silent audio error:', error);
        reject(error);
      })
      .pipe(outputStream, { end: true });
  });
};

/**
 * 순수 JavaScript로 무음 WAV 파일 생성
 */
const generateSilentWAV = (durationSeconds: number): Buffer => {
  const sampleRate = 44100;
  const numChannels = 2;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const numSamples = sampleRate * durationSeconds;
  const dataSize = numSamples * blockAlign;
  const fileSize = 44 + dataSize;

  const buffer = Buffer.alloc(fileSize);
  let offset = 0;

  // RIFF header
  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(fileSize - 8, offset); offset += 4;
  buffer.write('WAVE', offset); offset += 4;

  // fmt subchunk
  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4;
  buffer.writeUInt16LE(1, offset); offset += 2;
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(byteRate, offset); offset += 4;
  buffer.writeUInt16LE(blockAlign, offset); offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;

  // data subchunk
  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;

  console.log(`Generated silent WAV: ${durationSeconds}s, ${buffer.length} bytes`);

  return buffer;
};
