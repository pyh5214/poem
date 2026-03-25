import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const expiresIn = searchParams.get('expiresIn');
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${error}`);
      return;
    }

    if (token && expiresIn) {
      // Token is handled by AuthContext on mount
      // Redirect to home page
      navigate('/');
    } else {
      navigate('/login?error=no_token');
    }
  }, [navigate, searchParams]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="body1" color="text.secondary">
        로그인 처리 중...
      </Typography>
    </Box>
  );
};

export default AuthCallbackPage;
