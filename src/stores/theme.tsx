import { create } from 'zustand'
import { readBoolState, storeBoolState } from 'funcs/storage';

interface ThemeStore {
    isDarkTheme: boolean;
    setTheme: (isDarkTheme: boolean) => void;
    setThemeStyling: (isDarkTheme: boolean) => void;
    switchTheme: () => void;
}

let useThemeStore = create<ThemeStore>()(
    (set, get) => ({
        isDarkTheme: readBoolState("dark-theme"),
        setTheme: (isDarkTheme: boolean) => {
            set({ isDarkTheme: isDarkTheme })
        },
        switchTheme: () => {
            let inverse = !get().isDarkTheme;
            console.log(inverse)
            get().setTheme(inverse);
            storeBoolState("dark-theme", inverse);
            get().setThemeStyling(inverse);
        },
        setThemeStyling: (isDarkTheme: boolean) => {
            isDarkTheme 
                ? document.body.classList.add("dark-theme")
                : document.body.classList.remove("dark-theme");
        }
    })
)

export function setThemeStyling(isDarkTheme: boolean) {
    isDarkTheme 
    ? document.body.classList.add("dark-theme")
    : document.body.classList.remove("dark-theme");
}

export default useThemeStore;