import { selectUserProfile } from "../../redux/features/auth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useRef, useState } from "react";
import { RxCaretDown } from "react-icons/rx";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import styles from "../../styles/header/UserNav.module.css";
import btnStyles from "../../styles/elements/buttons.module.css";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { selectCurrentTheme, toggleTheme } from "../../redux/features/theme";
import { doc, updateDoc } from "firebase/firestore";

const UserNav = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(selectCurrentTheme);
  const userProfile = useAppSelector(selectUserProfile);

  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const userNavBtnRef = useRef<HTMLButtonElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateUserTheme = async () => {
      const userRef = doc(db, "users", userProfile.uid);
      await updateDoc(userRef, { userTheme: currentTheme });
    };
    updateUserTheme();
  }, [currentTheme, userProfile.uid]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !userNavBtnRef.current?.contains(event.target as Node) &&
        !themeBtnRef.current?.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <button
        className={styles.root}
        ref={userNavBtnRef}
        onClick={() => setShowUserMenu((prev) => !prev)}
      >
        <img src={userProfile.userImg} alt="User" className={styles.userImg} />
        <p className={styles.username}>{userProfile.username}</p>
        <RxCaretDown viewBox="1 1 13 13" className={styles.caretDown} />
      </button>

      {showUserMenu && (
        <div className={styles.userMenu}>
          <div className={styles.sectionTitle}>
            <HiOutlineUserCircle
              viewBox="1.5 1.5 20 20"
              style={{ strokeWidth: 1 }}
            />
            <h3>My Stuff</h3>
          </div>

          <div className={styles.userMenuSection}>
            <Link to={`/user/${userProfile.username}`}>Profile</Link>
            <Link to="/settings/profile">User Settings</Link>
          </div>

          <div className={styles.sectionTitle}>
            <BsEye />
            <h3>View Options</h3>
          </div>

          <div className={styles.userMenuSection}>
            <button onClick={() => dispatch(toggleTheme())} ref={themeBtnRef}>
              <span>Dark Mode</span>
              <div
                className={`${btnStyles.toggleBtn} ${
                  currentTheme === "dark"
                    ? btnStyles.toggleBtnActive
                    : undefined
                }`}
              >
                <div></div>
              </div>
            </button>
          </div>

          <button
            className={`${styles.sectionTitle} ${styles.sectionOnlyBtn}`}
            onClick={() => signOut(auth)}
          >
            <FiLogOut style={{ strokeWidth: 1 }} />
            <h3>Log Out</h3>
          </button>
        </div>
      )}
    </>
  );
};

export default UserNav;
