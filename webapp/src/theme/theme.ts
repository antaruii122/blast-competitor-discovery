'use client';

import { createTheme } from '@mui/material/styles';

// Theme matching ESGAMING project design
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#58a6ff',
            dark: '#1f6feb',
            light: '#79c0ff',
        },
        secondary: {
            main: '#238636',
            dark: '#1a7f37',
            light: '#2ea043',
        },
        background: {
            default: '#0d1117',
            paper: '#161b22',
        },
        error: {
            main: '#f85149',
        },
        warning: {
            main: '#d29922',
        },
        info: {
            main: '#58a6ff',
        },
        success: {
            main: '#238636',
        },
        text: {
            primary: '#c9d1d9',
            secondary: '#8b949e',
        },
        divider: '#30363d',
    },
    typography: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 6,
                    fontWeight: 500,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: '#21262d',
                },
            },
        },
    },
});

export default theme;
