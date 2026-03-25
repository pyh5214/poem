import React from 'react';
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const getErrorMessage = (error: string | null): string | null => {
    switch (error) {
      case 'account_blocked':
        return '계정이 차단되었습니다. 관리자에게 문의하세요.';
      case 'auth_failed':
        return '로그인에 실패했습니다. 다시 시도해주세요.';
      case 'no_code':
      case 'token_exchange_failed':
      case 'invalid_token':
        return '인증 과정에서 오류가 발생했습니다.';
      default:
        return null;
    }
  };

  const errorMessage = getErrorMessage(error);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          {/* Logo/Title */}
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              fontFamily: '"Nanum Myeongjo", serif',
              fontWeight: 700,
              color: '#1a1a2e',
            }}
          >
            빛으로 쓰다
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontFamily: '"Nanum Myeongjo", serif',
            }}
          >
            Written in Light
          </Typography>

          {/* Error message */}
          {errorMessage && (
            <Typography
              color="error"
              sx={{ mb: 3, fontSize: '0.9rem' }}
            >
              {errorMessage}
            </Typography>
          )}

          {/* Description */}
          <Typography
            variant="body2"
            sx={{ mb: 4, color: 'text.secondary' }}
          >
            사진으로 시를 만들고
            <br />
            나만의 음악 엽서를 간직하세요
          </Typography>

          {/* Google Login Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={login}
            fullWidth
            sx={{
              py: 1.5,
              bgcolor: '#fff',
              color: '#333',
              border: '1px solid #ddd',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: '#f5f5f5',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              },
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Google로 계속하기
          </Button>

          {/* Terms */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 3,
              color: 'text.disabled',
            }}
          >
            로그인하면 서비스 이용약관에 동의하게 됩니다
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
