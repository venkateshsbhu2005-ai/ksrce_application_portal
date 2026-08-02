import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  initializeTheme: () => set((state) => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: currentTheme };
  })
}));
