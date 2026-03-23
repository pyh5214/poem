import React from 'react';
import { Box, Typography } from '@mui/material';

interface PoemTitleProps {
  title: string;
  variant?: 'default' | 'postcard' | 'display';
}

const PoemTitle: React.FC<PoemTitleProps> = ({ title, variant = 'default' }) => {
  const styles = {
    default: {
      container: {
        mb: 2,
        pb: 1.5,
        borderBottom: '1px solid rgba(187, 186, 167, 0.2)',
      },
      title: {
        fontFamily: "'Newsreader', serif",
        fontStyle: 'italic',
        fontWeight: 500,
        fontSize: '1.25rem',
        color: '#38392a',
        letterSpacing: '-0.01em',
      },
    },
    postcard: {
      container: {
        mb: 2,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: 0,
          width: 40,
          height: 2,
          backgroundColor: 'rgba(170, 65, 75, 0.4)',
          borderRadius: 1,
        },
      },
      title: {
        fontFamily: "'Newsreader', serif",
        fontStyle: 'italic',
        fontWeight: 600,
        fontSize: '1.125rem',
        color: '#38392a',
        letterSpacing: '-0.01em',
      },
    },
    display: {
      container: {
        mb: 3,
        textAlign: 'center' as const,
        position: 'relative',
        '&::before': {
          content: '"❝"',
          position: 'absolute',
          top: -16,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Newsreader', serif",
          fontSize: '2rem',
          color: 'rgba(170, 65, 75, 0.3)',
          lineHeight: 1,
        },
      },
      title: {
        fontFamily: "'Newsreader', serif",
        fontStyle: 'italic',
        fontWeight: 500,
        fontSize: '1.5rem',
        color: '#38392a',
        letterSpacing: '-0.02em',
        pt: 2,
      },
    },
  };

  const currentStyle = styles[variant];

  return (
    <Box sx={currentStyle.container}>
      <Typography sx={currentStyle.title}>
        {title}
      </Typography>
    </Box>
  );
};

export default PoemTitle;
