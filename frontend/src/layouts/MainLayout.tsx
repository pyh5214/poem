import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header } from '../components/Header';
import BottomNav from '../components/BottomNav/BottomNav';
import { GrainOverlay } from '../components/GrainOverlay';

const MainLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'background.default',
        position: 'relative',
        pb: '80px', // BottomNav 높이만큼 패딩
      }}
    >
      <GrainOverlay opacity={0.025} />

      {/* Light Leak Background Effect */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background: `
            linear-gradient(
              135deg,
              rgba(254, 178, 70, 0.06) 0%,
              transparent 30%,
              transparent 70%,
              rgba(170, 65, 75, 0.04) 100%
            )
          `,
          zIndex: 0,
        }}
      />

      <Header title="Written in Light" />

      <Box
        component="main"
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Outlet />
      </Box>

      <BottomNav />
    </Box>
  );
};

export default MainLayout;
