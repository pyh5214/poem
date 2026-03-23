import { createTheme, ThemeOptions } from '@mui/material/styles';

// Analog Archivist Color System
const palette = {
  primary: {
    main: '#aa414b',
    light: '#d66e77',
    dark: '#7a2d35',
    contrastText: '#ffffff',
  },
  primaryContainer: {
    main: '#ffaaad',
    contrastText: '#3d0008',
  },
  secondary: {
    main: '#00706e',
    light: '#4d9d9b',
    dark: '#004544',
    contrastText: '#ffffff',
  },
  secondaryContainer: {
    main: '#94f2ef',
    contrastText: '#002020',
  },
  tertiary: {
    main: '#8c5900',
    light: '#b87d2a',
    dark: '#5c3a00',
    contrastText: '#ffffff',
  },
  tertiaryContainer: {
    main: '#feb246',
    contrastText: '#2c1600',
  },
  background: {
    default: '#feffd6',
    paper: '#ffffff',
  },
  surface: {
    main: '#feffd6',
    containerLowest: '#ffffff',
    containerLow: '#fcf9ee',
    container: '#f6f4e5',
    containerHigh: '#f0efdd',
    containerHighest: '#eae9d4',
  },
  text: {
    primary: '#38392a',
    secondary: '#656555',
  },
  outline: {
    main: '#828270',
    variant: '#bbbaa7',
  },
  error: {
    main: '#ba1a1a',
    light: '#ffdad6',
    dark: '#93000a',
    contrastText: '#ffffff',
  },
};

// Custom theme options
const themeOptions: ThemeOptions = {
  palette: {
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    text: palette.text,
    error: palette.error,
  },
  typography: {
    fontFamily: "'Newsreader', 'Noto Serif KR', serif",
    h1: {
      fontFamily: "'Newsreader', 'Noto Serif KR', serif",
      fontStyle: 'italic',
      fontWeight: 400,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: "'Newsreader', 'Noto Serif KR', serif",
      fontStyle: 'italic',
      fontWeight: 400,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: "'Newsreader', 'Noto Serif KR', serif",
      fontStyle: 'italic',
      fontWeight: 400,
    },
    h4: {
      fontFamily: "'Newsreader', 'Noto Serif KR', serif",
      fontStyle: 'italic',
      fontWeight: 400,
    },
    h5: {
      fontFamily: "'Newsreader', 'Noto Serif KR', serif",
      fontStyle: 'italic',
      fontWeight: 400,
    },
    h6: {
      fontFamily: "'Newsreader', 'Noto Serif KR', serif",
      fontStyle: 'italic',
      fontWeight: 400,
    },
    body1: {
      fontFamily: "'Newsreader', 'Noto Serif KR', serif",
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: "'Newsreader', 'Noto Serif KR', serif",
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      fontSize: '0.75rem',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    overline: {
      fontFamily: "'Space Grotesk', 'Noto Sans KR', sans-serif",
      fontSize: '0.625rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          backgroundColor: palette.primary.main,
          '&:hover': {
            backgroundColor: palette.primary.dark,
          },
        },
        outlined: {
          borderColor: palette.outline.main,
          color: palette.text.primary,
          '&:hover': {
            borderColor: palette.primary.main,
            backgroundColor: 'rgba(170, 65, 75, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
          backgroundColor: palette.surface.containerLow,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: palette.surface.containerLowest,
        },
        elevation1: {
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        },
        elevation2: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        },
        elevation3: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: palette.surface.containerLowest,
            '& fieldset': {
              borderColor: palette.outline.variant,
            },
            '&:hover fieldset': {
              borderColor: palette.outline.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: palette.primary.main,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '0.05em',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: palette.text.secondary,
          '&:hover': {
            backgroundColor: 'rgba(170, 65, 75, 0.08)',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: palette.surface.containerLow,
          borderTop: `1px solid ${palette.outline.variant}`,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: palette.text.secondary,
          '&.Mui-selected': {
            color: palette.primary.main,
          },
        },
        label: {
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.625rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
      },
    },
  },
};

// Custom palette augmentation for TypeScript
declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      main: string;
      containerLowest: string;
      containerLow: string;
      container: string;
      containerHigh: string;
      containerHighest: string;
    };
    outline: {
      main: string;
      variant: string;
    };
    primaryContainer: {
      main: string;
      contrastText: string;
    };
    secondaryContainer: {
      main: string;
      contrastText: string;
    };
    tertiary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    tertiaryContainer: {
      main: string;
      contrastText: string;
    };
  }
  interface PaletteOptions {
    surface?: {
      main?: string;
      containerLowest?: string;
      containerLow?: string;
      container?: string;
      containerHigh?: string;
      containerHighest?: string;
    };
    outline?: {
      main?: string;
      variant?: string;
    };
    primaryContainer?: {
      main?: string;
      contrastText?: string;
    };
    secondaryContainer?: {
      main?: string;
      contrastText?: string;
    };
    tertiary?: {
      main?: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    tertiaryContainer?: {
      main?: string;
      contrastText?: string;
    };
  }
}

// Create theme with custom palette
const theme = createTheme({
  ...themeOptions,
  palette: {
    ...themeOptions.palette,
    surface: palette.surface,
    outline: palette.outline,
    primaryContainer: palette.primaryContainer,
    secondaryContainer: palette.secondaryContainer,
    tertiary: palette.tertiary,
    tertiaryContainer: palette.tertiaryContainer,
  },
});

export default theme;
export { palette };
