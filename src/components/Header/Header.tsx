import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/img/logo.svg";
import { ReactComponent as LogoText } from "../../assets/img/logo_text.svg";
import styles from "../../styles/header/Header.module.css";
import btnStyles from "../../styles/elements/buttons.module.css";
import { RxCaretDown } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  openAuthModal,
  setLogInMode,
  setSignUpMode,
} from "../../redux/features/userAuthModal";
import { selectUserProfile } from "../../redux/features/auth";
import { BsPlusLg, BsBell, BsMoon, BsSun } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import UserNav from "./UserNav";
import { selectCurrentTheme, toggleTheme } from "../../redux/features/theme";

const Header = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(selectUserProfile);
  const currentTheme = useAppSelector(selectCurrentTheme);

  return (
    <header className={styles.root}>
      <div className={styles.leftSide}>
        <Link to="/" className={styles.logoContainer}>
          <Logo className={styles.logo} />
          <LogoText className={styles.logoText} />
        </Link>

        <button className={styles.navBtn}>
          {location.pathname === "/" ? (
            <>
              <FaHome className={styles.currentLocationImg} />
              <span className={styles.currentLocationInfo}>Home</span>
              <RxCaretDown viewBox="1 1 13 13" className={styles.caretDown} />
            </>
          ) : (
            ""
          )}
        </button>
      </div>

      <div className={styles.searchBarContainer}>
        <form className={styles.searchBarForm}>
          <label htmlFor="header-search-bar" className={styles.searchBarLabel}>
            <IoSearchOutline className={styles.searchBarIcon} />
          </label>
          <input
            className={styles.searchBarInput}
            type="search"
            id="header-search-bar"
            placeholder="Search"
          />
        </form>
      </div>

      <div className={styles.rightSide}>
        {userProfile.uid ? (
          <div className={styles.userBlock}>
            <Link to="/submit">
              <button className={styles.userInteractionBtns}>
                <BsPlusLg />
              </button>
            </Link>

            <button className={styles.userInteractionBtns}>
              <BsBell />
            </button>

            <UserNav />
          </div>
        ) : (
          <div className={styles.authBtns}>
            <button
              className={btnStyles.btnVariantTwo}
              onClick={() => {
                dispatch(openAuthModal());
                dispatch(setSignUpMode());
              }}
            >
              Sign Up
            </button>
            <button
              className={btnStyles.btnVariantOne}
              onClick={() => {
                dispatch(openAuthModal());
                dispatch(setLogInMode());
              }}
            >
              Log In
            </button>

            <button
              className={styles.themeBtn}
              onClick={() => dispatch(toggleTheme())}
            >
              {currentTheme === "light" ? <BsMoon /> : <BsSun />}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
