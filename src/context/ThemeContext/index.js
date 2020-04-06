import React, { useContext, useState } from "react";

import { mapping, light, dark } from "@eva-design/eva";
const themes = { light, dark };

export const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeContextProvider = ({ ...props }) => {
  const [themeType, setThemeType] = useState("light");
  const currentTheme = themes[themeType];

  const toggleThemeType = () => {
    const nextTheme = themeType === "light" ? "dark" : "light";
    setThemeType(nextTheme);
  };
  return (
    <ThemeContext.Provider
      {...props}
      value={{ themeType, currentTheme, toggleThemeType }}
    />
  );
};

export const useEvaTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};
