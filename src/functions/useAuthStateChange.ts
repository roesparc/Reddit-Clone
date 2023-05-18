import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { INITIAL_USER_PROFILE } from "../ts_common/initialStates";
import { updateUserProfile } from "../redux/features/auth";
import { setUserTheme } from "../redux/features/theme";
import { UserProfile } from "../ts_common/interfaces";
import { useAppDispatch } from "../redux/hooks";
import { useState, useEffect, useRef } from "react";

const useAuthStateChange = () => {
  const dispatch = useAppDispatch();
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const unsubUserSnapRef = useRef<() => void>();

  useEffect(() => {
    const subscribeToUser = (user: User) => {
      unsubUserSnapRef.current = onSnapshot(
        doc(db, "users", user.uid),
        (doc) => {
          if (doc.data()) {
            dispatch(updateUserProfile(doc.data() as UserProfile));
            dispatch(setUserTheme(doc.data()?.userTheme));
          }
          setIsInitialRender(false);
        }
      );
    };

    const resetUserState = () => {
      dispatch(updateUserProfile(INITIAL_USER_PROFILE));
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        subscribeToUser(user);
      } else if (unsubUserSnapRef.current) {
        unsubUserSnapRef.current();
        resetUserState();
      } else {
        setIsInitialRender(false);
      }
    });
  }, [dispatch]);

  return { isInitialRender };
};

export default useAuthStateChange;
