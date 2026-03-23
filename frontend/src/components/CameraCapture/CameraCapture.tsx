import React, { useRef, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Camera access error:', err);
        alert('Cannot access camera. Please check permissions.');
        onCancel();
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCancel]);

  const stopStream = (): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = (): void => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    stopStream();

    canvasRef.current.toBlob(blob => {
      if (blob) {
        onCapture(blob);
      }
    }, 'image/png');
  };

  const handleCancel = (): void => {
    stopStream();
    onCancel();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a1a',
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: '0.1em',
          }}
        >
          Capture Memory
        </Typography>
        <IconButton onClick={handleCancel} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Viewfinder */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Grain Overlay for Camera */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Light Leak Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: `
              radial-gradient(
                ellipse at top right,
                rgba(254, 178, 70, 0.15) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse at bottom left,
                rgba(170, 65, 75, 0.1) 0%,
                transparent 50%
              )
            `,
            mixBlendMode: 'screen',
          }}
        />

        {/* Viewfinder Marks */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {/* Center crosshair */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 40,
              height: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 1,
              height: 40,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          />

          {/* Corner marks */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
            <Box
              key={corner}
              sx={{
                position: 'absolute',
                width: 24,
                height: 24,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderStyle: 'solid',
                borderWidth: 0,
                ...(corner === 'top-left' && {
                  top: '15%',
                  left: '15%',
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                }),
                ...(corner === 'top-right' && {
                  top: '15%',
                  right: '15%',
                  borderTopWidth: 1,
                  borderRightWidth: 1,
                }),
                ...(corner === 'bottom-left' && {
                  bottom: '15%',
                  left: '15%',
                  borderBottomWidth: 1,
                  borderLeftWidth: 1,
                }),
                ...(corner === 'bottom-right' && {
                  bottom: '15%',
                  right: '15%',
                  borderBottomWidth: 1,
                  borderRightWidth: 1,
                }),
              }}
            />
          ))}
        </Box>

        {/* Frame overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.3)',
          }}
        />
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        }}
      >
        {/* Retro Shutter Button */}
        <Box
          onClick={handleCapture}
          sx={{
            position: 'relative',
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: '#feffd6',
            border: '4px solid #aa414b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
            },
            '&:active': {
              transform: 'scale(0.95)',
              '& > div': {
                transform: 'scale(0.9)',
              },
            },
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#aa414b',
              transition: 'transform 0.1s ease',
            }}
          />
        </Box>
      </Box>

      {/* Bottom Label */}
      <Box
        sx={{
          textAlign: 'center',
          pb: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.5625rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          Tap to capture
        </Typography>
      </Box>

      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width="640"
        height="480"
      />
    </Box>
  );
};

export default CameraCapture;
