import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

const lightColors = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  text: "#222222",
  muted: "#777777",
  border: "#E5E7EB",
  search: "#F8F9FB",
  serviceBg: "#FFF3EE",
  accent: "#FF5722",
  rating: "#F59E0B",
};

const darkColors = {
  background: "#121212",
  surface: "#1E1E1E",
  text: "#F5F5F5",
  muted: "#B0B0B0",
  border: "#383838",
  search: "#292929",
  serviceBg: "#38251F",
  accent: "#FF7043",
  rating: "#FBBF24",
};

export type ThemeColors = typeof lightColors;

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDark((previous) => !previous);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        colors: isDark ? darkColors : lightColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme harus digunakan di dalam ThemeProvider");
  }

  return context;
}
