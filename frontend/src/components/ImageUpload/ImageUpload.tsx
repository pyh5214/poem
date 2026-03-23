import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
import { Box, Typography } from '@mui/material';
import { PhotoCamera, CloudUpload } from '@mui/icons-material';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  onCameraClick: () => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect, onCameraClick, disabled = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    processFile(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = (file: File): void => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Only image files are accepted.');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be 10MB or less.');
      return;
    }

    onFileSelect(file);
  };

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Drag & Drop Area */}
      <Box
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          position: 'relative',
          border: '2px dashed',
          borderColor: isDragOver ? 'primary.main' : 'outline.variant',
          borderRadius: '8px',
          p: 4,
          textAlign: 'center',
          backgroundColor: isDragOver ? 'rgba(170, 65, 75, 0.05)' : 'surface.containerLowest',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.2s ease',
          '&:hover': disabled ? {} : {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(170, 65, 75, 0.02)',
          },
        }}
      >
        {/* Polaroid-style upload box */}
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              backgroundColor: 'surface.containerLow',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              boxShadow: '2px 4px 12px rgba(56, 57, 42, 0.15)',
            }}
          >
            <CloudUpload
              sx={{
                fontSize: 32,
                color: isDragOver ? 'primary.main' : 'text.secondary',
                transition: 'color 0.2s ease',
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Newsreader', serif",
              fontStyle: 'italic',
              color: 'text.primary',
            }}
          >
            {isDragOver ? 'Drop your image here' : 'Drag & drop or click to upload'}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: 'text.secondary',
              fontSize: '0.625rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            JPG, PNG, WEBP up to 10MB
          </Typography>
        </Box>
      </Box>

      {/* Camera Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2,
          gap: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: 'text.secondary',
            fontSize: '0.625rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Or capture with
        </Typography>

        {/* Circular Shutter Button */}
        <Box
          onClick={disabled ? undefined : onCameraClick}
          sx={{
            position: 'relative',
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'surface.containerLowest',
            border: '3px solid',
            borderColor: 'primary.main',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
            '&:hover': disabled ? {} : {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(170, 65, 75, 0.2)',
            },
            '&:active': disabled ? {} : {
              transform: 'scale(0.95)',
            },
          }}
        >
          {/* Inner circle */}
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.1s ease',
            }}
          >
            <PhotoCamera sx={{ color: 'white', fontSize: 20 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ImageUpload;
