import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { INITIAL_USER_PROFILE } from "../ts_common/initialStates";
import { AppDispatch } from "../redux/store";
import { updateCurrentUser, updateUserProfile } from "../redux/features/auth";
import { setUserTheme } from "../redux/features/theme";
import { UserProfile } from "../ts_common/interfaces";

const handleAuthStateChange = (
  dispatch: AppDispatch,
  completeInitialRender: () => void
) => {
  let unsubUserSnap: () => void;

  const subscribeToUser = (user: User) => {
    unsubUserSnap = onSnapshot(doc(db, "users", user.uid), (doc) => {
      dispatch(updateCurrentUser(user.uid));
      dispatch(updateUserProfile(doc.data() as UserProfile));
      dispatch(setUserTheme(doc.data()?.userTheme));
      completeInitialRender();
    });
  };

  const resetUserState = () => {
    dispatch(updateCurrentUser(undefined));
    dispatch(updateUserProfile(INITIAL_USER_PROFILE));
    dispatch(setUserTheme("light"));
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      subscribeToUser(user);
    } else if (unsubUserSnap) {
      unsubUserSnap();
      resetUserState();
    } else {
      completeInitialRender();
    }
  });
};

export default handleAuthStateChange;
