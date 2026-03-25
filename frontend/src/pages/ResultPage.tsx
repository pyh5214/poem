import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Button, Typography, IconButton, CircularProgress } from '@mui/material';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  ArrowBack as BackIcon,
  MusicNote as MusicIcon,
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import { PostcardView } from '../components/PostcardView';
import { MusicPlayer } from '../components/MusicPlayer';
import { useAppContext } from '../context/AppContext';
import { savePostcard } from '../utils/storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedResult, setGeneratedResult } = useAppContext();
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const postcardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!generatedResult) {
      navigate('/');
    }
  }, [generatedResult, navigate]);

  if (!generatedResult) {
    return null;
  }

  const handleGenerateMusic = async () => {
    setIsGeneratingMusic(true);
    setMusicError(null);

    try {
      const response = await fetch(`${API_URL}/generate-music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: generatedResult.imageData,
          poetStyle: generatedResult.poetStyle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate music');
      }

      const data = await response.json();
      setAudioData(data.audioData);
    } catch (error) {
      console.error('Music generation error:', error);
      setMusicError(error instanceof Error ? error.message : 'Failed to generate music');
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const capturePostcardImage = async (): Promise<Blob | null> => {
    if (!postcardRef.current) return null;
    const canvas = await html2canvas(postcardRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#ffffff',
    });
    return new Promise((resolve) => canvas.toBlob((blob: Blob | null) => resolve(blob), 'image/png'));
  };

  const handleSave = async () => {
    savePostcard({
      imageData: generatedResult.imageData,
      poem: generatedResult.poem,
      poetStyle: generatedResult.poetStyle,
      audioData: audioData || undefined,
    });

    // 엽서 이미지 다운로드
    const blob = await capturePostcardImage();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `poem-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleShare = async () => {
    const blob = await capturePostcardImage();

    // Web Share API (모바일 SNS 공유)
    if (navigator.share && blob) {
      try {
        const file = new File([blob], 'poem.png', { type: 'image/png' });
        await navigator.share({
          title: '나의 시',
          text: generatedResult.poem,
          files: [file],
        });
        return;
      } catch (error) {
        // 사용자가 취소한 경우 무시
        if ((error as Error).name === 'AbortError') return;
      }
    }

    // 폴백: 텍스트 공유 링크 (트위터/X)
    const tweetText = encodeURIComponent(generatedResult.poem.slice(0, 200));
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, '_blank');
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
      <Box ref={postcardRef}>
        <PostcardView
          imageData={generatedResult.imageData}
          poem={generatedResult.poem}
          createdAt={new Date().toISOString()}
          poetStyle={generatedResult.poetStyle}
        />
      </Box>

      {/* Music Generation Section */}
      <Box sx={{ mt: 3 }}>
        {!audioData && !isGeneratingMusic && (
          <Button
            variant="outlined"
            startIcon={<MusicIcon />}
            onClick={handleGenerateMusic}
            fullWidth
            sx={{
              borderColor: 'rgba(170, 65, 75, 0.3)',
              color: 'primary.main',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              py: 1.5,
              borderRadius: '24px',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(170, 65, 75, 0.05)',
              },
            }}
          >
            배경음악 생성
          </Button>
        )}

        {isGeneratingMusic && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 3,
            }}
          >
            <CircularProgress size={32} sx={{ color: 'primary.main' }} />
            <Typography
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.75rem',
                color: 'text.secondary',
                letterSpacing: '0.05em',
              }}
            >
              음악을 생성하고 있습니다...
            </Typography>
          </Box>
        )}

        {musicError && (
          <Box
            sx={{
              textAlign: 'center',
              py: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.75rem',
                color: 'error.main',
                mb: 1,
              }}
            >
              {musicError}
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={handleGenerateMusic}
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.625rem',
                textTransform: 'uppercase',
              }}
            >
              다시 시도
            </Button>
          </Box>
        )}

        {audioData && <MusicPlayer audioData={audioData} />}
      </Box>

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
          startIcon={<DownloadIcon />}
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
          다운로드
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
