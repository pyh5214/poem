import React from 'react';
import { Box, Typography } from '@mui/material';
import PolaroidCard from './PolaroidCard';
import { SavedPostcard } from '../../utils/storage';

interface PolaroidGridProps {
  postcards: SavedPostcard[];
  onCardClick?: (postcard: SavedPostcard) => void;
}

const PolaroidGrid: React.FC<PolaroidGridProps> = ({ postcards, onCardClick }) => {
  // 비대칭적인 회전 값 생성
  const getRotation = (index: number): number => {
    const rotations = [-3, 2, -1, 3, -2, 1, -3, 2];
    return rotations[index % rotations.length];
  };

  // 비대칭적인 상단 마진 생성
  const getMarginTop = (index: number): number => {
    const margins = [0, 24, 8, 16, 32, 12, 4, 20];
    return margins[index % margins.length];
  };

  if (postcards.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            mb: 3,
            opacity: 0.3,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23bbbaa7'%3E%3Cpath d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 18l4-5 2.5 3 3.5-4.5 4.5 6H4z'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
        <Typography
          sx={{
            fontFamily: "'Newsreader', serif",
            fontStyle: 'italic',
            fontSize: '1.25rem',
            color: '#6b6a5d',
            mb: 1,
          }}
        >
          No memories yet
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.75rem',
            color: '#9c9b8e',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Create and save your first verse
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 3,
        p: 2,
      }}
    >
      {postcards.map((postcard, index) => (
        <Box
          key={postcard.id}
          sx={{
            mt: `${getMarginTop(index)}px`,
          }}
        >
          <PolaroidCard
            imageData={postcard.imageData}
            poem={postcard.poem}
            createdAt={postcard.createdAt}
            rotation={getRotation(index)}
            onClick={() => onCardClick?.(postcard)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default PolaroidGrid;
