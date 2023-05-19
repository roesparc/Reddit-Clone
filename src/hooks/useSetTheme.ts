import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentTheme } from "../redux/features/theme";
import styles from "../styles/ThemeColorVariables.module.css";

const useSetTheme = () => {
  const currentTheme = useAppSelector(selectCurrentTheme);

  useEffect(() => {
    document.documentElement.classList.toggle(
      styles.lightTheme,
      currentTheme === "light"
    );

    document.documentElement.classList.toggle(
      styles.darkTheme,
      currentTheme === "dark"
    );
  }, [currentTheme]);
};

export default useSetTheme;
