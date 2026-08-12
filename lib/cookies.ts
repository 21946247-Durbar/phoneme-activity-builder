import Cookies from 'js-cookie';

export const COOKIE_KEYS = {
  THEME: 'phoneme_theme',
  SETTINGS: 'phoneme_settings',
} as const;

export const getTheme = (): 'light' | 'dark' => {
  const theme = Cookies.get(COOKIE_KEYS.THEME) as 'light' | 'dark';
  return theme || 'light';
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  Cookies.set(COOKIE_KEYS.THEME, theme, { 
    expires: 365, 
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
};

export const getSettings = (): Record<string, any> => {
  try {
    const settings = Cookies.get(COOKIE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {};
  } catch {
    return {};
  }
};

export const setSettings = (settings: Record<string, any>): void => {
  Cookies.set(COOKIE_KEYS.SETTINGS, JSON.stringify(settings), {
    expires: 365,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
};