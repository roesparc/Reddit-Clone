import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  closeAuthModal,
  setSignUpMode,
} from "../../redux/features/userAuthModal";
import { auth } from "../../firebase/config";
import styles from "../../styles/AuthFormsShared.module.css";

const LogInForm = () => {
  const dispatch = useAppDispatch();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);

  const [emailMessage, setEmailMessage] = useState<string>("");

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => dispatch(closeAuthModal()))
      .catch(() => {
        setEmailMessage("Incorrect username or password");
        setIsEmailValid(false);
        setIsPasswordValid(false);
      });
  };

  const blurInputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const onSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailMessage("");
    setIsEmailValid(true);
    setIsPasswordValid(true);

    signIn();
  };

  useEffect(() => {
    if (email.length) {
      if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        emailRef.current?.setCustomValidity("Not a valid email address");
        setEmailMessage("Not a valid email address");
        setIsEmailValid(false);
      } else {
        emailRef.current?.setCustomValidity("");
        setEmailMessage("");
        setIsEmailValid(true);
      }
    } else {
      setIsEmailValid(false);
    }
  }, [email]);

  return (
    <div className={styles.formWrapper}>
      <h1>Log In</h1>

      <form onSubmit={onSubmitLogin}>
        <fieldset
          className={
            !isEmailValid && emailMessage.length
              ? styles.inputInvalid
              : isEmailValid
              ? styles.inputValid
              : undefined
          }
        >
          <input
            type="text"
            id="sign-up-email"
            placeholder=" "
            required
            ref={emailRef}
            onBlur={(e) => setEmail(e.target.value)}
            onKeyDown={blurInputOnKeyDown}
          />
          <label htmlFor="sign-up-email">Email</label>
          <p>{emailMessage}</p>
        </fieldset>

        <fieldset
          className={!isPasswordValid ? styles.inputInvalid : undefined}
        >
          <input
            type="password"
            id="sign-up-password"
            placeholder=" "
            required
            ref={passwordRef}
            onBlur={(e) => setPassword(e.target.value)}
            onKeyDown={blurInputOnKeyDown}
          />
          <label htmlFor="sign-up-password">Password</label>
        </fieldset>

        <p className={styles.helper}>
          Forget your <span className={styles.fakeLink}>username</span> or{" "}
          <span className={styles.fakeLink}>password</span> ?
        </p>

        <button className={styles.submitBtn} type="submit">
          Log In
        </button>
      </form>

      <p className={styles.helper}>
        New to Re_edit?{" "}
        <button
          className={styles.fakeLink}
          onClick={() => dispatch(setSignUpMode())}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LogInForm;
