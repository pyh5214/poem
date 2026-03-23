import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { ContentCopy, Share, Bookmark } from '@mui/icons-material';

interface PoemDisplayProps {
  poem: string;
  poetName?: string;
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({ poem, poetName }) => {
  if (!poem) {
    return null;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopy = (): void => {
    navigator.clipboard.writeText(poem);
  };

  const handleShare = (): void => {
    if (navigator.share) {
      navigator.share({
        title: 'Generated Poem',
        text: poem,
      });
    } else {
      handleCopy();
      alert('Poem copied to clipboard!');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Paper Stack Effect Container */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'surface.containerLowest',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
          p: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 3,
            left: 3,
            right: -3,
            bottom: -3,
            backgroundColor: 'surface.containerLow',
            borderRadius: '4px',
            zIndex: -1,
            transform: 'rotate(0.5deg)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 6,
            left: 6,
            right: -6,
            bottom: -6,
            backgroundColor: 'surface.container',
            borderRadius: '4px',
            zIndex: -2,
            transform: 'rotate(-0.5deg)',
          },
        }}
      >
        {/* Header with metadata */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'outline.variant',
          }}
        >
          {/* Metadata Stamps */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                backgroundColor: 'surface.container',
                borderRadius: '4px',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.5625rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                }}
              >
                {currentDate}
              </Typography>
            </Box>
            {poetName && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1,
                  py: 0.5,
                  backgroundColor: 'primaryContainer.main',
                  borderRadius: '4px',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.5625rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'primary.dark',
                  }}
                >
                  {poetName}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Copy">
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopy sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton size="small" onClick={handleShare}>
                <Share sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save">
              <IconButton size="small">
                <Bookmark sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Poem Content */}
        <Box sx={{ p: 3 }}>
          <Typography
            component="pre"
            sx={{
              fontFamily: "'Newsreader', 'Noto Serif KR', serif",
              fontStyle: 'italic',
              fontSize: '1rem',
              lineHeight: 2,
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
              m: 0,
              textAlign: 'left',
            }}
          >
            {poem}
          </Typography>
        </Box>

        {/* Light Leak Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            borderRadius: '4px',
            background: `
              linear-gradient(
                135deg,
                rgba(254, 178, 70, 0.08) 0%,
                transparent 40%,
                transparent 60%,
                rgba(170, 65, 75, 0.05) 100%
              )
            `,
            mixBlendMode: 'overlay',
          }}
        />
      </Box>
    </Box>
  );
};

export default PoemDisplay;
