import { selectUserProfile } from "../../redux/features/auth";
import { useAppSelector } from "../../redux/hooks";
import { useEffect, useRef, useState } from "react";
import { RxCaretDown } from "react-icons/rx";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import styles from "../../styles/header/UserNav.module.css";
import btnStyles from "../../styles/elements/buttons.module.css";

const UserNav = () => {
  const userProfile = useAppSelector(selectUserProfile);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const userNavBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userNavBtnRef.current?.contains(event.target as Node)) {
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
            <Link to="/settings">User Settings</Link>
          </div>

          <div className={styles.sectionTitle}>
            <BsEye />
            <h3>View Options</h3>
          </div>

          <div className={styles.userMenuSection}>
            <button>
              <span>Dark Mode</span>
              <button className={btnStyles.toggleBtn}>
                <div></div>
              </button>
            </button>
          </div>

          <button className={`${styles.sectionTitle} ${styles.sectionOnlyBtn}`}>
            <FiLogOut style={{ strokeWidth: 1 }} />
            <h3>Log Out</h3>
          </button>
        </div>
      )}
    </>
  );
};

export default UserNav;
