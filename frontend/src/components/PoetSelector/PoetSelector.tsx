import React from 'react';
import { Box, Typography } from '@mui/material';
import { PoetOption } from '../../types';
import { POETS } from '../../constants/poets';

interface PoetSelectorProps {
  value: PoetOption;
  onChange: (value: PoetOption) => void;
  disabled?: boolean;
}

const PoetSelector: React.FC<PoetSelectorProps> = ({ value, onChange, disabled = false }) => {
  const handleSelect = (poetValue: PoetOption): void => {
    if (!disabled) {
      onChange(poetValue);
    }
  };

  // Asymmetric offsets for Editorial layout
  const getOffset = (index: number): number => {
    const offsets = [0, 8, 4, 12];
    return offsets[index % offsets.length];
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="overline"
        component="label"
        sx={{
          display: 'block',
          mb: 1.5,
          color: 'text.secondary',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        스타일 선택
      </Typography>

      {/* Asymmetric Editorial Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1.5,
        }}
      >
        {POETS.map((poet, index) => {
          const isSelected = value === poet.value;
          return (
            <Box
              key={poet.value}
              onClick={() => handleSelect(poet.value)}
              sx={{
                position: 'relative',
                p: 2,
                mt: `${getOffset(index)}px`,
                // No-Line Rule: use tonal shift instead of border
                backgroundColor: isSelected ? 'primaryContainer.main' : 'surface.containerLowest',
                // Ghost border for accessibility (15% opacity)
                boxShadow: isSelected
                  ? '0 0 0 2px rgba(170, 65, 75, 0.4)'
                  : '0 0 0 1px rgba(187, 186, 167, 0.15)',
                borderRadius: '6px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                transition: 'all 0.3s ease',
                textAlign: 'left',
                '&:hover': disabled ? {} : {
                  backgroundColor: isSelected ? 'primaryContainer.main' : 'surface.containerLow',
                  transform: 'translateY(-2px)',
                  boxShadow: isSelected
                    ? '0 0 0 2px rgba(170, 65, 75, 0.5), 0 8px 16px rgba(56, 57, 42, 0.1)'
                    : '0 0 0 1px rgba(187, 186, 167, 0.25), 0 8px 16px rgba(56, 57, 42, 0.08)',
                },
              }}
            >
              {/* Selection Indicator - Film frame style */}
              {isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 12,
                    height: 12,
                    borderRadius: '2px',
                    backgroundColor: 'primary.main',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 3,
                      left: 3,
                      width: 6,
                      height: 6,
                      borderRadius: '1px',
                      backgroundColor: 'white',
                    },
                  }}
                />
              )}

              {/* Style Name */}
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Newsreader', serif",
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: 'text.primary',
                  mb: 0.5,
                  pr: 3,
                }}
              >
                {poet.label}
              </Typography>

              {/* Style Description */}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: 'text.secondary',
                  fontSize: '0.625rem',
                  letterSpacing: '0.03em',
                  lineHeight: 1.4,
                }}
              >
                {poet.description}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PoetSelector;
