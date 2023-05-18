import { HashRouter } from "react-router-dom";
import styles from "./styles/App.module.css";
import Header from "./components/Header/Header";
import UserAuthModal from "./components/UserAuthModal/UserAuthModal";
import { useAppSelector } from "./redux/hooks";
import Main from "./components/Main";
import { selectCurrentTheme } from "./redux/features/theme";
import useAuthStateChange from "./functions/useAuthStateChange";

const App = () => {
  const currentTheme = useAppSelector(selectCurrentTheme);
  const { isInitialRender } = useAuthStateChange();

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
