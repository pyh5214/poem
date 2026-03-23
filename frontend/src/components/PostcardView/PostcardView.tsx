import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { parsePoem } from '../../utils/poemParser';
import { PoemTitle } from '../PoemTitle';

interface PostcardViewProps {
  imageData: string;
  poem: string;
  createdAt?: string;
  poetStyle?: string;
  onClick?: () => void;
}

const PostcardView: React.FC<PostcardViewProps> = ({
  imageData,
  poem,
  createdAt,
  poetStyle,
  onClick,
}) => {
  const parsedPoem = useMemo(() => parsePoem(poem), [poem]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: `
          0 1px 1px rgba(0,0,0,0.05),
          0 10px 0 -5px #fcf9ee,
          0 10px 1px -4px rgba(0,0,0,0.05),
          0 20px 0 -10px #f6f4e5,
          0 20px 1px -9px rgba(0,0,0,0.03)
        `,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: `
                0 4px 8px rgba(0,0,0,0.1),
                0 14px 0 -5px #fcf9ee,
                0 14px 4px -4px rgba(0,0,0,0.08),
                0 24px 0 -10px #f6f4e5,
                0 24px 4px -9px rgba(0,0,0,0.05)
              `,
            }
          : {},
      }}
    >
      {/* Light Leak Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '40%',
          background: `linear-gradient(
            135deg,
            rgba(255, 170, 173, 0.25) 0%,
            rgba(254, 178, 70, 0.15) 50%,
            transparent 100%
          )`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Image Section */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={imageData}
          alt="Postcard image"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Poem Section */}
      <Box
        sx={{
          p: 3,
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Top Title */}
        {parsedPoem.title && parsedPoem.titlePosition === 'top' && (
          <PoemTitle title={parsedPoem.title} variant="postcard" />
        )}

        {/* Poem Body */}
        <Typography
          sx={{
            fontFamily: "'Newsreader', 'Noto Serif KR', serif",
            fontStyle: 'italic',
            fontSize: '1rem',
            lineHeight: 1.8,
            color: '#38392a',
            whiteSpace: 'pre-wrap',
            mb: parsedPoem.titlePosition === 'bottom' ? 2 : 2,
            minHeight: parsedPoem.title ? '60px' : '80px',
          }}
        >
          {parsedPoem.body}
        </Typography>

        {/* Bottom Title (SNS Style) */}
        {parsedPoem.title && parsedPoem.titlePosition === 'bottom' && (
          <PoemTitle title={parsedPoem.title} variant="postcard" />
        )}

        {/* Metadata */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 2,
            borderTop: '1px solid rgba(187, 186, 167, 0.15)',
          }}
        >
          {poetStyle && (
            <Typography
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.625rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#6b6a5d',
              }}
            >
              {poetStyle}
            </Typography>
          )}
          {createdAt && (
            <Typography
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.625rem',
                letterSpacing: '0.05em',
                color: '#6b6a5d',
              }}
            >
              {formatDate(createdAt)}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Paper Texture Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.03,
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23bbbaa7' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </Box>
  );
};

export default PostcardView;
