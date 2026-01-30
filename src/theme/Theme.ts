import { createTheme, alpha } from '@mui/material/styles';

// Premium Banking Kiosk Theme
// Designed for next-gen self-service banking terminals

// Light Mode Palette
const lightPalette = {
  primary: {
    main: '#0A2540', // Deep Navy Blue
    light: '#153E65',
    dark: '#051526',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#00D4FF', // Cyan accent
    light: '#67E8F9',
    dark: '#0891B2',
    contrastText: '#000000',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    disabled: '#94A3B8',
  },
  action: {
    hover: alpha('#0A2540', 0.04), // primaryMain
    selected: alpha('#0A2540', 0.08),
    disabled: '#CBD5E1',
    disabledBackground: '#F1F5F9',
  },
  divider: '#E2E8F0',
};

// Dark Mode Palette - High-end Fintech Terminal
const darkPalette = {
  primary: {
    main: '#38BDF8', // Sky Blue for better visibility on dark
    light: '#7DD3FC',
    dark: '#0284C7',
    contrastText: '#000000',
  },
  secondary: {
    main: '#00D4FF', // Cyan accent (Neon)
    light: '#67E8F9',
    dark: '#0891B2',
    contrastText: '#000000',
  },
  background: {
    default: '#020617', // Deepest Navy/Black
    paper: '#0F172A',   // Dark Navy
  },
  text: {
    primary: '#F8FAFC', // Slate 50
    secondary: '#94A3B8', // Slate 400
    disabled: '#475569', // Slate 600
  },
  action: {
    hover: alpha('#38BDF8', 0.08),
    selected: alpha('#38BDF8', 0.16),
    disabled: '#475569',
    disabledBackground: '#1E293B',
  },
  divider: '#1E293B', // Slate 800
};

const commonColors = {
  success: {
    main: '#10B981', // Emerald green
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B', // Amber
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#000000',
  },
  error: {
    main: '#EF4444', // Red
    light: '#F87171',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
};

export const getTheme = (mode: 'light' | 'dark') => {
  const palette = mode === 'light' ? lightPalette : darkPalette;
  const isDark = mode === 'dark';
  const primaryMain = palette.primary.main;

  return createTheme({
    palette: {
      mode,
      ...palette,
      ...commonColors,
    },

    // Custom shadows for premium depth
    shadows: mode === 'light' ? [
      'none',
      '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      // Colored shadows for primary elements
      `0 10px 40px ${alpha(primaryMain, 0.15)}`,
      `0 15px 50px ${alpha(primaryMain, 0.2)}`,
      `0 20px 60px ${alpha(primaryMain, 0.25)}`,
      // Success glow
      `0 0 20px ${alpha(commonColors.success.main, 0.3)}`,
      // Error glow
      `0 0 20px ${alpha(commonColors.error.main, 0.3)}`,
      // Neutral elevation levels
      '0 0 0 1px rgba(0, 0, 0, 0.05)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 16px 32px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 20px 40px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 24px 48px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 32px 64px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 40px 80px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 48px 96px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 56px 112px rgba(0, 0, 0, 0.1)',
      '0 0 0 1px rgba(0, 0, 0, 0.05), 0 64px 128px rgba(0, 0, 0, 0.15)',
    ] : [ // Dark mode shadows - more glowy, less distinct shadows
      'none',
      '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
      '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
      '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      // Colored shadows (Glows in dark mode)
      `0 0 30px ${alpha(primaryMain, 0.2)}`,
      `0 0 50px ${alpha(primaryMain, 0.25)}`,
      `0 0 70px ${alpha(primaryMain, 0.3)}`,
      // Success glow
      `0 0 30px ${alpha(commonColors.success.main, 0.2)}`,
      // Error glow
      `0 0 30px ${alpha(commonColors.error.main, 0.2)}`,
      // Neutral elevations
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 1px 2px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 4px 8px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 8px 16px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 12px 24px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 16px 32px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 20px 40px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 24px 48px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 32px 64px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 40px 80px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 48px 96px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 56px 112px rgba(0,0,0,0.5)`,
      `0 0 0 1px ${alpha('#FFFFFF', 0.1)}, 0 64px 128px rgba(0,0,0,0.6)`,
    ],

    shape: {
      borderRadius: 12,
    },

    typography: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

      // Headings - Bold and confident
      h1: {
        fontWeight: 800,
        fontSize: '3.5rem',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.3,
        letterSpacing: '-0.005em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
      },

      // Body text - Readable and calm
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.01em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },

      // Buttons - Clear and confident
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        letterSpacing: '0.02em',
      },

      // Captions and small text
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4,
        letterSpacing: '0.03em',
        color: isDark ? '#94A3B8' : '#64748B',
      },

      // Overline for labels
      overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: isDark ? '#94A3B8' : '#64748B',
      },
    },

    components: {
      // Global Styles for smooth transitions
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden', // Prevent horizontal scroll from animations
          },
          '.MuiPaper-root': {
            transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important',
          },
          '.MuiTypography-root': {
            transition: 'color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '.MuiButtonBase-root': {
            transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '.MuiSvgIcon-root': {
            transition: 'fill 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }
        },
      },

      // Button - Premium feel with depth
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '14px 28px',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isDark ? '0 0 20px rgba(56, 189, 248, 0.2)' : '0 8px 20px rgba(0, 0, 0, 0.12)',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: isDark ? '0 0 10px rgba(56, 189, 248, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
          },
          sizeLarge: {
            padding: '18px 36px',
            fontSize: '1.125rem',
            borderRadius: 14,
          },
          containedPrimary: {
            background: isDark
              ? `linear-gradient(135deg, ${primaryMain} 0%, ${palette.primary.light} 100%)`
              : `linear-gradient(135deg, ${primaryMain} 0%, ${palette.primary.light} 100%)`,
            color: isDark ? '#000000' : '#FFFFFF',
            boxShadow: `0 4px 14px ${alpha(primaryMain, 0.25)}`,
            '&:hover': {
              background: isDark
                ? `linear-gradient(135deg, ${palette.primary.light} 0%, ${primaryMain} 100%)`
                : `linear-gradient(135deg, ${palette.primary.light} 0%, ${primaryMain} 100%)`,
              boxShadow: `0 8px 25px ${alpha(primaryMain, 0.35)}`,
            },
          },
          outlined: {
            borderWidth: 2,
            borderColor: isDark ? alpha(primaryMain, 0.5) : alpha(primaryMain, 0.5),
            '&:hover': {
              borderWidth: 2,
              backgroundColor: alpha(primaryMain, 0.04),
              borderColor: primaryMain,
            },
          },
        },
      },

      // Paper - Soft elevation
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: 16,
          },
          // Adjust elevation shadows for dark mode if needed (handled by shadows array)
        },
      },

      // TextField - Premium input styling
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s ease',
              '& fieldset': {
                borderColor: isDark ? alpha('#FFFFFF', 0.2) : 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? palette.primary.light : palette.primary.light,
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 3px ${alpha(primaryMain, 0.1)}`,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: primaryMain,
                borderWidth: 2,
              },
              backgroundColor: isDark ? alpha('#FFFFFF', 0.03) : 'transparent',
            },
            '& .MuiInputBase-input': {
              fontSize: '1rem',
              padding: '16px',
              color: palette.text.primary,
            },
            '& .MuiInputLabel-root': {
              color: palette.text.secondary,
            },
          },
        },
      },

      // Card - Subtle depth
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0, 0, 0, 0.1)',
              borderColor: isDark ? alpha(primaryMain, 0.3) : 'rgba(0,0,0,0.04)',
            },
          },
        },
      },

      // Chip - Modern look
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
          outlined: {
            borderWidth: 1.5,
          },
        },
      },

      // Stepper - Clean progress
      MuiStepLabel: {
        styleOverrides: {
          label: {
            fontWeight: 500,
            '&.Mui-active': {
              fontWeight: 600,
              color: palette.text.primary,
            },
            '&.Mui-completed': {
              fontWeight: 600,
              color: palette.text.primary,
            },
          },
        },
      },

      MuiStepIcon: {
        styleOverrides: {
          root: {
            fontSize: '2rem',
            color: isDark ? alpha('#FFFFFF', 0.2) : '#BDBDBD',
            '&.Mui-active': {
              color: primaryMain,
            },
            '&.Mui-completed': {
              color: commonColors.success.main,
            },
          },
          text: {
            fill: isDark ? '#000000' : '#FFFFFF',
          }
        },
      },

      // AppBar - Clean header
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'}`,
            backgroundColor: isDark ? alpha(palette.background.default, 0.8) : alpha(palette.background.paper, 0.8),
            backdropFilter: 'blur(12px)',
          },
        },
      },

      // Alert - Softer styling
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '12px 16px',
          },
          standardError: {
            backgroundColor: alpha(commonColors.error.main, 0.08),
            color: isDark ? '#F87171' : '#DC2626',
          },
          standardSuccess: {
            backgroundColor: alpha(commonColors.success.main, 0.08),
            color: isDark ? '#34D399' : '#059669',
          },
        },
      },

      // Fab - Elevated action
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },

      // Table - Clean data display
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F1F5F9',
            padding: '16px',
            color: palette.text.primary,
          },
          head: {
            fontWeight: 600,
            backgroundColor: isDark ? alpha('#FFFFFF', 0.02) : '#F8FAFC',
            color: palette.text.secondary,
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: isDark ? alpha('#FFFFFF', 0.04) : '#F8FAFC',
            },
          },
        },
      },

      // CircularProgress - Smoother
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            color: primaryMain,
          },
        },
      },

      // Dialog
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: palette.background.paper,
            backgroundImage: 'none',
            borderRadius: 20,
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }
        }
      }
    },
  });
};

// Also export default as light theme for backward compatibility during migration
const defaultTheme = getTheme('light');
export default defaultTheme;

