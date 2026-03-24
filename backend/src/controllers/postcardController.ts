import { Request, Response } from 'express';
import { postcardService } from '../services/postcardService';
import { fileStorageService } from '../services/fileStorageService';
import { generatePoemFromImage } from '../services/openaiService';
import { generateMusicPrompt } from '../services/musicPromptService';
import { generateMusic } from '../services/geminiMusicService';
import { convertWAVtoMP3, encodeToBase64, estimateDuration, generateSilentAudio } from '../services/audioService';
import { poetPrompts } from '../config/prompts';
import { config } from '../config';
import { CreatePostcardRequest, CreateFullPostcardRequest, ErrorResponse, PoetOption } from '../types';

export const postcardController = {
  /**
   * POST /create-postcard - 통합 API: 이미지 → 시 → 음악 → 저장
   */
  async createFull(req: Request, res: Response): Promise<void> {
    console.log('=== Create full postcard request ===');

    try {
      const { imageData, poetStyle } = req.body as CreateFullPostcardRequest;

      // 입력 검증
      if (!imageData) {
        res.status(400).json({
          error: 'Image data is required'
        } as ErrorResponse);
        return;
      }

      const validStyles: PoetOption[] = ['A', 'B', 'C', 'D'];
      const style: PoetOption = validStyles.includes(poetStyle) ? poetStyle : 'A';

      console.log('Poet style:', style);

      // Step 1: 시 생성
      console.log('Step 1: Generating poem...');
      const systemPrompt = poetPrompts[style];
      const poemResult = await generatePoemFromImage(imageData, systemPrompt);
      const poem = poemResult.poem;
      console.log('Poem generated:', poem.substring(0, 50) + '...');

      // 시에서 제목 추출 (첫 줄)
      const poemLines = poem.split('\n').filter(line => line.trim());
      const title = poemLines[0] || '무제';

      // Step 2: 음악 프롬프트 생성
      console.log('Step 2: Generating music prompt...');
      const musicPrompt = await generateMusicPrompt(imageData, style);

      // Step 3: 음악 생성
      console.log('Step 3: Generating music...');
      let audioData = '';
      let duration = 0;

      if (config.vertexAI.projectId) {
        try {
          const wavBuffer = await generateMusic(musicPrompt, style);
          if (wavBuffer.length > 0) {
            const mp3Buffer = await convertWAVtoMP3(wavBuffer);
            audioData = encodeToBase64(mp3Buffer);
            duration = estimateDuration(mp3Buffer) || config.vertexAI.musicDuration;
          }
        } catch (musicError) {
          console.error('Music generation failed, using silent audio:', musicError);
          const silentMp3 = await generateSilentAudio(config.vertexAI.musicDuration);
          audioData = encodeToBase64(silentMp3);
          duration = config.vertexAI.musicDuration;
        }
      } else {
        console.log('Vertex AI not configured, using silent audio');
        const silentMp3 = await generateSilentAudio(30);
        audioData = encodeToBase64(silentMp3);
        duration = 30;
      }

      // Step 4: 이미지 base64에서 실제 데이터 추출
      const imageBase64 = imageData.includes(',')
        ? imageData.split(',')[1]
        : imageData;

      // Step 5: DB에 저장
      console.log('Step 5: Saving to database...');
      const postcard = postcardService.create({
        poem,
        title,
        poetStyle: style,
        musicPrompt,
        imageData: imageBase64,
        audioData,
        duration
      });

      console.log('Postcard created:', postcard.id);

      res.status(201).json({
        postcard,
        poem,
        audioData
      });

    } catch (error) {
      console.error('Create full postcard error:', error);
      res.status(500).json({
        error: 'Failed to create postcard',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  /**
   * POST /postcards - Create a new postcard
   */
  create(req: Request, res: Response): void {
    try {
      const body: CreatePostcardRequest = req.body;

      // Validate required fields
      if (!body.poem || !body.poetStyle) {
        res.status(400).json({
          error: 'Missing required fields',
          details: 'poem and poetStyle are required'
        } as ErrorResponse);
        return;
      }

      // Validate poetStyle
      if (!['A', 'B', 'C', 'D'].includes(body.poetStyle)) {
        res.status(400).json({
          error: 'Invalid poetStyle',
          details: 'poetStyle must be A, B, C, or D'
        } as ErrorResponse);
        return;
      }

      const postcard = postcardService.create(body);
      res.status(201).json(postcard);
    } catch (error) {
      console.error('Error creating postcard:', error);
      res.status(500).json({
        error: 'Failed to create postcard',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  /**
   * GET /postcards - List all postcards with pagination
   */
  list(req: Request, res: Response): void {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      const result = postcardService.list(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Error listing postcards:', error);
      res.status(500).json({
        error: 'Failed to list postcards',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  /**
   * GET /postcards/:id - Get a single postcard
   */
  getById(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const postcard = postcardService.getById(id);

      if (!postcard) {
        res.status(404).json({
          error: 'Postcard not found'
        } as ErrorResponse);
        return;
      }

      res.json(postcard);
    } catch (error) {
      console.error('Error getting postcard:', error);
      res.status(500).json({
        error: 'Failed to get postcard',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  /**
   * DELETE /postcards/:id - Delete a postcard
   */
  delete(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const success = postcardService.delete(id);

      if (!success) {
        res.status(404).json({
          error: 'Postcard not found'
        } as ErrorResponse);
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting postcard:', error);
      res.status(500).json({
        error: 'Failed to delete postcard',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  /**
   * GET /postcards/:id/image - Serve image file
   */
  getImage(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const postcard = postcardService.getById(id);

      if (!postcard || !postcard.imagePath) {
        res.status(404).json({
          error: 'Image not found'
        } as ErrorResponse);
        return;
      }

      const absolutePath = fileStorageService.getAbsolutePath(postcard.imagePath);
      res.sendFile(absolutePath);
    } catch (error) {
      console.error('Error serving image:', error);
      res.status(500).json({
        error: 'Failed to serve image',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  },

  /**
   * GET /postcards/:id/audio - Serve audio file
   */
  getAudio(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const postcard = postcardService.getById(id);

      if (!postcard || !postcard.audioPath) {
        res.status(404).json({
          error: 'Audio not found'
        } as ErrorResponse);
        return;
      }

      const absolutePath = fileStorageService.getAbsolutePath(postcard.audioPath);
      res.sendFile(absolutePath);
    } catch (error) {
      console.error('Error serving audio:', error);
      res.status(500).json({
        error: 'Failed to serve audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ErrorResponse);
    }
  }
};
