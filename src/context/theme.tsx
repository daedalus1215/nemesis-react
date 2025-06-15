import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#0f0', // Indigo 500
    },
    secondary: {
      main: '#0f0', // Bright green (matches your a color)
    },
    background: {
      default: '#1a1a1a',
      paper: '#242424',
    },
    text: {
      primary: '#fff',
      secondary: '#9ca3af',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e42',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#28a745',
    },
  },
};

export const theme = createTheme(themeOptions); 