import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/img/logo.svg";
import { ReactComponent as LogoText } from "../assets/img/logo_text.svg";
import styles from "../styles/Header.module.css";
import btnStyles from "../styles/elements/buttons.module.css";
import { AiFillHome } from "react-icons/ai";
import { RxCaretDown } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineDarkMode } from "react-icons/md";
import { useAppDispatch } from "../redux/hooks";
import {
  openAuthModal,
  setLogInMode,
  setSignUpMode,
} from "../redux/features/userAuthModal";

const Header = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

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
              <AiFillHome className={styles.currentLocationImg} />
              <span className={styles.currentLocationInfo}>Home</span>
              <RxCaretDown className={styles.caretDown} />
            </>
          ) : (
            ""
          )}
        </button>

        <div className={styles.searchBarContainer}>
          <form className={styles.searchBarForm}>
            <label
              htmlFor="header-search-bar"
              className={styles.searchBarLabel}
            >
              <IoSearchOutline className={styles.searchBarIcon} />
            </label>
            <input
              className={styles.searchBarInput}
              type="search"
              id="header-search-bar"
              placeholder="Search users & subreddits"
            />
          </form>
        </div>
      </div>

      <div className={styles.rightSide}>
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
        <button className={styles.themeBtn}>
          <MdOutlineDarkMode />
        </button>
      </div>
    </header>
  );
};

export default Header;
