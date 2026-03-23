import React from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
  showAvatar?: boolean;
  onMenuClick?: () => void;
  onAvatarClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = 'Written in Light',
  showMenu = false,
  showAvatar = false,
  onMenuClick,
  onAvatarClick,
}) => {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        // No-Line Rule: tonal shift instead of border
        backgroundColor: 'surface.containerLow',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left - Menu */}
      <Box sx={{ width: 40 }}>
        {showMenu && (
          <IconButton onClick={onMenuClick} size="small">
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Center - Logo */}
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontFamily: "'Newsreader', serif",
          fontStyle: 'italic',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>

      {/* Right - Avatar */}
      <Box sx={{ width: 40 }}>
        {showAvatar && (
          <IconButton onClick={onAvatarClick} size="small" sx={{ p: 0 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primaryContainer.main',
                color: 'primary.main',
                fontSize: '0.875rem',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              P
            </Avatar>
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Header;
