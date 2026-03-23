import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
}

const developingMessages = [
  'Developing...',
  'Processing film...',
  'Exposing image...',
  'Mixing chemicals...',
  'Creating poetry...',
];

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  message,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!loading) {
      setCurrentMessageIndex(0);
      setDots('');
      return;
    }

    // Rotate through messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % developingMessages.length);
    }, 3000);

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, [loading]);

  if (!loading) {
    return null;
  }

  const displayMessage = message || developingMessages[currentMessageIndex];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        mt: 2,
      }}
    >
      {/* Film Developing Animation */}
      <Box
        sx={{
          position: 'relative',
          width: 120,
          height: 120,
          mb: 3,
        }}
      >
        {/* Film frame */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 80,
            height: 100,
            backgroundColor: 'surface.containerLowest',
            borderRadius: '2px',
            boxShadow: '2px 4px 12px rgba(56, 57, 42, 0.2)',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                linear-gradient(
                  180deg,
                  rgba(170, 65, 75, 0.1) 0%,
                  transparent 50%,
                  rgba(254, 178, 70, 0.1) 100%
                )
              `,
              animation: 'developing 2s ease-in-out infinite',
            },
          }}
        >
          {/* Image placeholder with developing effect */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              right: 8,
              bottom: 32,
              backgroundColor: 'surface.containerHigh',
              borderRadius: '1px',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 0.4,
                  filter: 'brightness(0.8)',
                },
                '50%': {
                  opacity: 0.8,
                  filter: 'brightness(1.1)',
                },
              },
            }}
          />
        </Box>

        {/* Rotating ring */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 110,
            height: 110,
            border: '2px solid',
            borderColor: 'outline.variant',
            borderTopColor: 'primary.main',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
              '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
            },
          }}
        />
      </Box>

      {/* Message with typewriter cursor */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Newsreader', serif",
            fontStyle: 'italic',
            color: 'text.primary',
            fontSize: '1rem',
          }}
        >
          {displayMessage}
        </Typography>

        {/* Typewriter Cursor */}
        <Box
          sx={{
            display: 'inline-block',
            width: '2px',
            height: '1.2em',
            backgroundColor: 'primary.main',
            ml: '2px',
            animation: 'blink 1s infinite',
            '@keyframes blink': {
              '0%, 50%': { opacity: 1 },
              '51%, 100%': { opacity: 0 },
            },
          }}
        />
      </Box>

      {/* Progress indicator */}
      <Typography
        variant="caption"
        sx={{
          mt: 1,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.625rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'text.secondary',
        }}
      >
        Please wait{dots}
      </Typography>
    </Box>
  );
};

export default LoadingOverlay;
