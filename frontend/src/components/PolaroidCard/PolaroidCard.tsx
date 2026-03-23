import React from 'react';
import { Box, Typography } from '@mui/material';

interface PolaroidCardProps {
  imageData: string;
  poem?: string;
  createdAt?: string;
  rotation?: number;
  onClick?: () => void;
}

const PolaroidCard: React.FC<PolaroidCardProps> = ({
  imageData,
  poem,
  createdAt,
  rotation = 0,
  onClick,
}) => {
  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        backgroundColor: '#ffffff',
        padding: '12px 12px 48px 12px',
        borderRadius: '2px',
        cursor: onClick ? 'pointer' : 'default',
        transform: `rotate(${rotation}deg)`,
        boxShadow: '0 10px 30px -10px rgba(56, 57, 42, 0.15)',
        transition: 'all 0.3s ease',
        filter: 'grayscale(30%)',
        '&:hover': {
          filter: 'grayscale(0%)',
          transform: `rotate(0deg) scale(1.02)`,
          boxShadow: '0 15px 40px -10px rgba(56, 57, 42, 0.25)',
          zIndex: 10,
        },
      }}
    >
      {/* Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          overflow: 'hidden',
          backgroundColor: '#f6f4e5',
        }}
      >
        <Box
          component="img"
          src={imageData}
          alt="Memory"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Light leak on hover */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(
              135deg,
              rgba(255, 170, 173, 0.2) 0%,
              transparent 60%
            )`,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '.MuiBox-root:hover &': {
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Caption Area */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 12,
          right: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {poem && (
          <Typography
            sx={{
              fontFamily: "'Newsreader', serif",
              fontStyle: 'italic',
              fontSize: '0.75rem',
              color: '#6b6a5d',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '70%',
            }}
          >
            {poem.split('\n')[0]}
          </Typography>
        )}
        {createdAt && (
          <Typography
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.625rem',
              color: '#9c9b8e',
              letterSpacing: '0.05em',
            }}
          >
            {formatDate(createdAt)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PolaroidCard;
