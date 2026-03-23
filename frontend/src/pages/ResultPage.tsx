import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Button, Typography, IconButton } from '@mui/material';
import {
  Save as SaveIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { PostcardView } from '../components/PostcardView';
import { useAppContext } from '../context/AppContext';
import { savePostcard } from '../utils/storage';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedResult, setGeneratedResult } = useAppContext();

  useEffect(() => {
    if (!generatedResult) {
      navigate('/');
    }
  }, [generatedResult, navigate]);

  if (!generatedResult) {
    return null;
  }

  const handleSave = () => {
    savePostcard({
      imageData: generatedResult.imageData,
      poem: generatedResult.poem,
      poetStyle: generatedResult.poetStyle,
    });

    alert('저장되었습니다!');
    navigate('/library');
  };

  const handleShare = async () => {
    // 간단한 공유 - 클립보드에 시 복사
    try {
      await navigator.clipboard.writeText(generatedResult.poem);
      alert('시가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('복사에 실패했습니다.');
    }
  };

  const handleRetry = () => {
    setGeneratedResult(null);
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 2,
        px: 2,
      }}
    >
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
        >
          <BackIcon />
        </IconButton>
      </Box>

      {/* Page Title */}
      <Box sx={{ textAlign: 'left', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Newsreader', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'text.primary',
          }}
        >
          Your Verse
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.625rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            mt: 0.5,
          }}
        >
          A moment captured in words
        </Typography>
      </Box>

      {/* Postcard */}
      <PostcardView
        imageData={generatedResult.imageData}
        poem={generatedResult.poem}
        createdAt={new Date().toISOString()}
        poetStyle={generatedResult.poetStyle}
      />

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 4,
          justifyContent: 'center',
        }}
      >
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            px: 3,
            py: 1.5,
            borderRadius: '24px',
            boxShadow: '0 4px 12px rgba(170, 65, 75, 0.3)',
            '&:hover': {
              backgroundColor: 'primary.dark',
              boxShadow: '0 6px 16px rgba(170, 65, 75, 0.4)',
            },
          }}
        >
          저장
        </Button>

        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={handleShare}
          sx={{
            borderColor: 'outline.variant',
            color: 'text.primary',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            px: 3,
            py: 1.5,
            borderRadius: '24px',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(170, 65, 75, 0.05)',
            },
          }}
        >
          공유
        </Button>

        <Button
          variant="text"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
          sx={{
            color: 'text.secondary',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            px: 3,
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          다시
        </Button>
      </Box>
    </Container>
  );
};

export default ResultPage;
