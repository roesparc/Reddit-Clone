import { HashRouter } from "react-router-dom";
import styles from "./styles/App.module.css";
import Header from "./components/Header";
import UserAuthModal from "./components/UserAuthModal/UserAuthModal";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import getUserProfile from "./functions/getUserProfile";
import { useAppDispatch } from "./redux/hooks";
import { updateCurrentUser, updateUserProfile } from "./redux/features/auth";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      const userProfile = await getUserProfile(user?.uid);
      dispatch(updateCurrentUser(user?.uid));
      dispatch(updateUserProfile(userProfile));
    });
  }, [dispatch]);

  return (
    <div className={styles.light}>
      <HashRouter>
        <Header />
        <UserAuthModal />
      </HashRouter>
    </div>
  );
};

export default App;
