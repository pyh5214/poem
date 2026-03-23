import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Typography } from '@mui/material';
import { PoetOption } from '../types';
import { POETS, getPoetStyleLabel } from '../constants/poets';
import { PoetSelector } from '../components/PoetSelector';
import { PoemDisplay } from '../components/PoemDisplay';
import { ImageUpload } from '../components/ImageUpload';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useAppContext } from '../context/AppContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const { setGeneratedResult, capturedImage, setCapturedImage } = useAppContext();
  const [poem, setPoem] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [poetOption, setPoetOption] = useState<PoetOption>('A');
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const currentPoet = POETS.find(p => p.value === poetOption);

  // 카메라에서 촬영한 이미지가 있으면 자동으로 제출
  useEffect(() => {
    if (capturedImage) {
      // base64를 Blob으로 변환
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          setCurrentImage(capturedImage);
          handleSubmitFromCapture(blob, capturedImage);
          setCapturedImage(null);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturedImage]);

  const handleSubmitFromCapture = async (imageFileOrBlob: File | Blob, imageDataUrl?: string): Promise<void> => {
    await handleSubmitInternal(imageFileOrBlob, imageDataUrl);
  };

  const handleSubmitInternal = async (imageFileOrBlob: File | Blob, imageDataUrl?: string): Promise<void> => {
    const formData = new FormData();

    if (imageFileOrBlob instanceof File) {
      formData.append('image', imageFileOrBlob);
      // File을 base64로 변환
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentImage(e.target?.result as string);
      };
      reader.readAsDataURL(imageFileOrBlob);
    } else {
      formData.append('image', imageFileOrBlob, 'captured-image.png');
      if (imageDataUrl) {
        setCurrentImage(imageDataUrl);
      }
    }
    formData.append('option', poetOption);

    setLoading(true);
    setPoem('');

    try {
      const response = await axios.post<{ poem: string }>(`${API_URL}/generate-poem`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      const generatedPoem = response.data.poem;
      setPoem(generatedPoem);

      // 결과 저장 및 결과 페이지로 이동
      if (currentImage || imageDataUrl) {
        setGeneratedResult({
          imageData: currentImage || imageDataUrl || '',
          poem: generatedPoem,
          poetStyle: getPoetStyleLabel(poetOption),
        });
        navigate('/result');
      }
    } catch (error) {
      console.error('Poem generation error:', error);
      let errorMessage = '시 생성 중 오류가 발생했습니다.';

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const serverError = error.response.data as { error?: string; details?: string };
          errorMessage = serverError?.error || errorMessage;
          if (serverError?.details) {
            errorMessage += `\n\n상세: ${serverError.details}`;
          }
        } else if (error.request) {
          errorMessage = '서버에 연결할 수 없습니다.\n백엔드 서버가 실행 중인지 확인해주세요.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = '요청 시간이 초과되었습니다.\n네트워크 연결을 확인하고 다시 시도해주세요.';
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCurrentImage(imageData);
      handleSubmitInternal(file, imageData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 4,
        px: 2,
      }}
    >
      {/* Main Card */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'surface.containerLowest',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(56, 57, 42, 0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Card Header - No-Line Rule: tonal shift instead of border */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            backgroundColor: 'surface.containerLow',
            textAlign: 'left',
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontFamily: "'Newsreader', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            Create
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: 'text.secondary',
              fontSize: '0.625rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Transform moments into verse
          </Typography>
        </Box>

        {/* Card Body */}
        <Box sx={{ p: 3 }}>
          <PoetSelector value={poetOption} onChange={setPoetOption} disabled={loading} />

          <ImageUpload
            onFileSelect={handleFileSelect}
            onCameraClick={() => navigate('/capture')}
            disabled={loading}
          />

          <LoadingOverlay loading={loading} />

          <PoemDisplay poem={poem} poetName={currentPoet?.label} />
        </Box>

        {/* Paper texture overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23bbbaa7' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </Box>

      {/* Footer */}
      <Box
        sx={{
          mt: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.5625rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'text.secondary',
          }}
        >
          Analog Archivist
        </Typography>
      </Box>
    </Container>
  );
};

export default GeneratePage;
