import {
  closeAuthModal,
  selectAuthMode,
  selectIsUserAuthOpen,
} from "../../redux/features/userAuthModal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import styles from "../../styles/userAuthModal/UserAuthModal.module.css";
import { GrClose } from "react-icons/gr";
import { ReactComponent as Logo } from "../../assets/img/logo.svg";
import LogInForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const UserAuthModal = () => {
  const isUserAuthOpen = useAppSelector(selectIsUserAuthOpen);
  const authMode = useAppSelector(selectAuthMode);
  const dispatch = useAppDispatch();

  return (
    <>
      {isUserAuthOpen && (
        <div>
          <div className={styles.overlay}></div>

          <div className={styles.root}>
            <button
              className={styles.closeBtn}
              onClick={() => dispatch(closeAuthModal())}
            >
              <GrClose />
            </button>

            <Logo className={styles.logo} />

            {authMode === "logIn" && <LogInForm />}

            {authMode === "signUp" && <SignUpForm />}
          </div>
        </div>
      )}
    </>
  );
};

export default UserAuthModal;
