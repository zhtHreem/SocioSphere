import { createTheme } from '@mui/material/styles';

// Design tokens shared by MUI and plain CSS (see index.css)
export const palette = {
  ink: '#0E1030',
  inkSoft: '#2A2D55',
  paper: '#F3F5FF',
  white: '#FFFFFF',
  blue: '#3D5AFE',
  pink: '#FF3D8B',
  mint: '#19E3B1',
  violet: '#8B5CF6',
  sky: '#38BDF8',
  lime: '#C6F432',
};

export const gradients = {
  hero: `linear-gradient(135deg, ${palette.blue} 0%, ${palette.violet} 50%, ${palette.pink} 100%)`,
  cool: `linear-gradient(135deg, ${palette.sky} 0%, ${palette.blue} 100%)`,
  fresh: `linear-gradient(135deg, ${palette.mint} 0%, ${palette.sky} 100%)`,
  hot: `linear-gradient(135deg, ${palette.pink} 0%, ${palette.violet} 100%)`,
};

const display = '"Bricolage Grotesque", "Figtree", system-ui, sans-serif';
const body = '"Figtree", system-ui, -apple-system, "Segoe UI", sans-serif';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.blue, contrastText: '#fff' },
    secondary: { main: palette.pink, contrastText: '#fff' },
    success: { main: '#0FBF8F' },
    info: { main: palette.sky },
    background: { default: palette.paper, paper: palette.white },
    text: { primary: palette.ink, secondary: '#5B5F8A' },
    divider: 'rgba(14,16,48,0.1)',
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: body,
    h1: { fontFamily: display, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.02 },
    h2: { fontFamily: display, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 },
    h3: { fontFamily: display, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1 },
    h4: { fontFamily: display, fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontFamily: display, fontWeight: 700, letterSpacing: '-0.015em' },
    h6: { fontFamily: display, fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: palette.paper },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '10px 22px',
          transition: 'transform .2s ease, box-shadow .2s ease, background .2s ease',
          '&:hover': { transform: 'translateY(-2px)' },
        },
        containedPrimary: {
          background: gradients.hero,
          backgroundSize: '140% 140%',
          boxShadow: '0 10px 24px -8px rgba(61,90,254,.6)',
          '&:hover': { boxShadow: '0 16px 30px -8px rgba(255,61,139,.55)', backgroundPosition: '100% 0' },
        },
        outlined: { borderWidth: 2, '&:hover': { borderWidth: 2 } },
        sizeLarge: { padding: '14px 30px', fontSize: '1.02rem' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 22 },
        outlined: { borderColor: 'rgba(14,16,48,0.08)' },
        elevation1: { boxShadow: '0 10px 30px -14px rgba(14,16,48,.25)' },
        elevation3: { boxShadow: '0 18px 44px -18px rgba(14,16,48,.35)' },
        elevation6: { boxShadow: '0 28px 60px -24px rgba(14,16,48,.45)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid rgba(14,16,48,0.07)',
          boxShadow: '0 14px 36px -18px rgba(14,16,48,.28)',
          overflow: 'hidden',
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 700, borderRadius: 999 } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#fff',
          '& fieldset': { borderColor: 'rgba(14,16,48,0.14)', borderWidth: 1.5 },
          '&:hover fieldset': { borderColor: palette.blue },
          '&.Mui-focused fieldset': { borderColor: palette.blue, borderWidth: 2 },
        },
      },
    },
    MuiTab: { styleOverrides: { root: { fontWeight: 700, fontSize: '1rem' } } },
    MuiTabs: { styleOverrides: { indicator: { height: 4, borderRadius: 4, background: gradients.hero } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 28 } } },
    MuiAvatar: { styleOverrides: { root: { fontFamily: display, fontWeight: 700 } } },
  },
});

export default theme;
