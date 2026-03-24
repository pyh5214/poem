import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');
const AUDIO_DIR = path.join(UPLOADS_DIR, 'audio');

// Ensure directories exist
[UPLOADS_DIR, IMAGES_DIR, AUDIO_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export const fileStorageService = {
  /**
   * Save base64 image data to file
   */
  saveImage(id: string, base64Data: string): string {
    const buffer = Buffer.from(base64Data, 'base64');
    const ext = detectImageExtension(buffer);
    const filename = `${id}.${ext}`;
    const filePath = path.join(IMAGES_DIR, filename);

    fs.writeFileSync(filePath, buffer);
    return `uploads/images/${filename}`;
  },

  /**
   * Save base64 audio data to file (WAV format)
   */
  saveAudio(id: string, base64Data: string): string {
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `${id}.wav`;
    const filePath = path.join(AUDIO_DIR, filename);

    fs.writeFileSync(filePath, buffer);
    return `uploads/audio/${filename}`;
  },

  /**
   * Read image file as base64
   */
  readImage(relativePath: string): string | null {
    const filePath = path.join(__dirname, '../../', relativePath);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath).toString('base64');
  },

  /**
   * Read audio file as base64
   */
  readAudio(relativePath: string): string | null {
    const filePath = path.join(__dirname, '../../', relativePath);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath).toString('base64');
  },

  /**
   * Get absolute path for serving files
   */
  getAbsolutePath(relativePath: string): string {
    return path.join(__dirname, '../../', relativePath);
  },

  /**
   * Delete file
   */
  deleteFile(relativePath: string): boolean {
    const filePath = path.join(__dirname, '../../', relativePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
};

/**
 * Detect image format from buffer magic bytes
 */
function detectImageExtension(buffer: Buffer): string {
  // JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'jpg';
  }
  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return 'png';
  }
  // GIF
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return 'gif';
  }
  // WebP
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
    return 'webp';
  }
  // Default to jpg
  return 'jpg';
}
