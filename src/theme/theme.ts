import { createTheme } from '@mui/material/styles';

export const SIDEBAR_WIDTH = 240;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a2b4a',      // Deep navy — professional, trustworthy
      light: '#2e4070',
      dark: '#0f1a2e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e8532a',      // Warm orange — action, urgency
      light: '#ff7043',
      dark: '#bf360c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f6f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2b4a',
      secondary: '#5a6a85',
    },
    success: { main: '#2e7d52' },
    warning: { main: '#f59e0b' },
    error:   { main: '#d32f2f' },
    info:    { main: '#0288d1' },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"DM Serif Display", Georgia, serif', fontWeight: 400 },
    h2: { fontFamily: '"DM Serif Display", Georgia, serif', fontWeight: 400 },
    h3: { fontFamily: '"DM Serif Display", Georgia, serif', fontWeight: 400 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.75rem' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
            color: '#5a6a85',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backgroundColor: '#f4f6f9',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a2b4a',
          color: '#ffffff',
          borderRight: 'none',
        },
      },
    },
  },
});

export default theme;
