import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';

type Language = 'ko' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'ko',
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'ko' ? 'en' : 'ko' })),
    }),
    {
      name: 'scope-language',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          // Return a no-op storage for SSR
          const noopStorage: StateStorage = {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
          return noopStorage;
        }
        return localStorage;
      }),
    }
  )
);
