import { HashRouter } from "react-router-dom";
import styles from "./styles/App.module.css";
import Header from "./components/Header/Header";
import UserAuthModal from "./components/UserAuthModal/UserAuthModal";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import handleAuthStateChange from "./functions/handleAuthStateChange ";
import Main from "./components/Main";
import { selectCurrentTheme } from "./redux/features/theme";

const App = () => {
  const currentTheme = useAppSelector(selectCurrentTheme);
  const dispatch = useAppDispatch();
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

  const completeInitialRender = () => {
    setIsInitialRender(false);
  };

  useEffect(() => {
    handleAuthStateChange(dispatch, completeInitialRender);
  }, [dispatch]);

  return (
    <div
      className={`${styles.root} ${
        currentTheme === "light" ? styles.lightTheme : styles.darkTheme
      }`}
    >
      {!isInitialRender && (
        <HashRouter>
          <Header />
          <Main />
          <UserAuthModal />
        </HashRouter>
      )}
    </div>
  );
};

export default App;
