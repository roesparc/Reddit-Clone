import { HashRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import UserAuthModal from "./components/UserAuthModal/UserAuthModal";
import Main from "./components/Main";
import useAuthStateChange from "./hooks/useAuthStateChange";
import ScrollToTop from "./components/ScrollToTop";
import useSetTheme from "./hooks/useSetTheme";

const App = () => {
  const { isInitialRender } = useAuthStateChange();
  useSetTheme();

  return (
    <div>
      {!isInitialRender && (
        <HashRouter>
          <ScrollToTop />
          <Header />
          <Main />
          <UserAuthModal />
        </HashRouter>
      )}
    </div>
  );
};

export default App;
