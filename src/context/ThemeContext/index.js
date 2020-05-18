import React, { useContext, useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import { mapping, light, dark } from "@eva-design/eva";
const themes = { light, dark };

export const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeContextProvider = ({ ...props }) => {
  const [themeType, setThemeType] = useState("light");
  const currentTheme = themes[themeType];

  useEffect(() => {
    const fetchTheme = async () => {
      const theme =
        (await AsyncStorage.getItem("@nativegram/theme")) || "light";
      setThemeType(theme);
    };
    fetchTheme();
  }, []);

  useEffect(() => {
    const setThemeStorage = async (newt) => {
      await AsyncStorage.setItem("@nativegram/theme", newt);
    };
    setThemeStorage(themeType);
  }, [themeType]);

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
