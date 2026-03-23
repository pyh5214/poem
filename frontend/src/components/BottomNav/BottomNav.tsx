import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
  Home as HomeIcon,
  CameraAlt as CameraIcon,
  Add as AddIcon,
  Collections as LibraryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

type NavValue = '/' | '/capture' | '/generate' | '/library' | '/settings';

const navItems: { value: NavValue; label: string; icon: React.ReactNode }[] = [
  { value: '/', label: '홈', icon: <HomeIcon /> },
  { value: '/capture', label: '촬영', icon: <CameraIcon /> },
  { value: '/generate', label: '생성', icon: <AddIcon /> },
  { value: '/library', label: '보관함', icon: <LibraryIcon /> },
  { value: '/settings', label: '설정', icon: <SettingsIcon /> },
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentValue = (): NavValue => {
    const path = location.pathname;
    if (path === '/' || path === '/generate') return '/';
    if (path.startsWith('/capture')) return '/capture';
    if (path.startsWith('/library')) return '/library';
    if (path.startsWith('/settings')) return '/settings';
    if (path.startsWith('/result')) return '/';
    return '/';
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: NavValue): void => {
    if (newValue === '/generate') {
      navigate('/');
    } else {
      navigate(newValue);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        // Safe area for mobile
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: 'rgba(254, 255, 214, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid',
          borderColor: 'outline.variant',
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px 8px',
            color: 'text.secondary',
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.625rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginTop: '4px',
            '&.Mui-selected': {
              fontSize: '0.625rem',
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            value={item.value}
            label={item.label}
            icon={item.icon}
            sx={
              item.value === '/generate'
                ? {
                    '& .MuiSvgIcon-root': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '8px',
                      fontSize: '2.5rem',
                    },
                  }
                : {}
            }
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default BottomNav;
