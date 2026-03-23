import React from 'react';
import { Box } from '@mui/material';

interface GrainOverlayProps {
  opacity?: number;
}

const GrainOverlay: React.FC<GrainOverlayProps> = ({ opacity = 0.03 }) => {
  return (
    <Box
      className="grain-overlay"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity,
      }}
    />
  );
};

export default GrainOverlay;
