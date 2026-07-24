import { create } from "zustand";

export interface ThemeState {
    theme: string;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: 'light',
    setTheme: () => set((state) => ({theme: state.theme =='light' ? 'dark': 'light'})),
    getTheme: () => {
        const state = get();
        return state.theme;
    }
}))