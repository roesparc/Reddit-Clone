import { HashRouter } from "react-router-dom";
import styles from "./styles/App.module.css";
import Header from "./components/Header/Header";
import UserAuthModal from "./components/UserAuthModal/UserAuthModal";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/config";
import { useAppDispatch } from "./redux/hooks";
import { updateCurrentUser, updateUserProfile } from "./redux/features/auth";
import { setUserTheme } from "./redux/features/theme";
import { doc, onSnapshot } from "firebase/firestore";
import { UserProfile } from "./ts_common/interfaces";
import { INITIAL_USER_PROFILE } from "./ts_common/initialStates";

const App = () => {
  const dispatch = useAppDispatch();
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

  useEffect(() => {
    let unsubUserSnap: () => void;

    const subscribeToUser = (user: User) => {
      unsubUserSnap = onSnapshot(doc(db, "users", user.uid), (doc) => {
        dispatch(updateCurrentUser(user.uid));
        dispatch(updateUserProfile(doc.data() as UserProfile));
        dispatch(setUserTheme(doc.data()?.userTheme));
        setIsInitialRender(false);
      });
    };

    const resetUserState = () => {
      dispatch(updateCurrentUser(undefined));
      dispatch(updateUserProfile(INITIAL_USER_PROFILE));
      dispatch(setUserTheme("light"));
    };

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        subscribeToUser(user);
      } else if (unsubUserSnap) {
        unsubUserSnap();
        resetUserState();
      } else {
        setIsInitialRender(false);
      }
    });
  }, [dispatch]);

  return (
    <div className={styles.lightTheme}>
      {!isInitialRender && (
        <HashRouter>
          <Header />
          <UserAuthModal />
        </HashRouter>
      )}
    </div>
  );
};

export default App;
