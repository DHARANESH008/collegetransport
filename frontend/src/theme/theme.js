import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#3b82f6', // Electric Indigo/Blue
        light: '#60a5fa',
        dark: '#1d4ed8',
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#10b981', // Emerald Green
        light: '#34d399',
        dark: '#059669',
        contrastText: '#ffffff'
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706'
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#b91c1c'
      },
      info: {
        main: '#06b6d4',
        light: '#22d3ee',
        dark: '#0891b2'
      },
      background: {
        default: isDark ? '#0b132b' : '#f8fafc',
        paper: isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.95)',
        elevated: isDark ? '#1e293b' : '#ffffff'
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#475569'
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Outfit", "Noto Sans Tamil", sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.025em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.015em' },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 }
    },
    shape: {
      borderRadius: 14
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.78)' : '#ffffff',
            backdropFilter: 'blur(20px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(226, 232, 240, 0.8)',
            borderRadius: 20,
            boxShadow: isDark
              ? '0 15px 35px -10px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.06)'
              : '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: isDark
                ? '0 25px 45px -10px rgba(0,0,0,0.7), 0 0 25px rgba(59,130,246,0.25)'
                : '0 20px 30px -10px rgba(0,0,0,0.1)'
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 20px',
            fontSize: '0.95rem',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 6px 20px -4px rgba(59, 130, 246, 0.4)'
            }
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none'
          }
        }
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.8)'
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(226, 232, 240, 0.8)',
            padding: '14px 16px'
          },
          head: {
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.03em',
            textTransform: 'uppercase'
          }
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'medium'
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
            '& fieldset': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(203, 213, 225, 0.8)'
            },
            '&:hover fieldset': {
              borderColor: '#3b82f6'
            }
          }
        }
      }
    }
  });
};
