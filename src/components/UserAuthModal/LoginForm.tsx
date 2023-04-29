import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  closeAuthModal,
  setSignUpMode,
} from "../../redux/features/userAuthModal";
import { auth } from "../../firebase/config";
import styles from "../../styles/userAuthModal/AuthFormsShared.module.css";
import { ImSpinner2 } from "react-icons/im";

const LogInForm = () => {
  const dispatch = useAppDispatch();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");

  const [reportEmailValidity, setReportEmailValidity] =
    useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const disableInputs = () => {
    emailRef.current?.setAttribute("disabled", "true");
    passwordRef.current?.setAttribute("disabled", "true");
  };

  const enableInputs = () => {
    emailRef.current?.removeAttribute("disabled");
    passwordRef.current?.removeAttribute("disabled");
  };

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => dispatch(closeAuthModal()))
      .catch(() => {
        setEmailErrorMessage("Incorrect username or password");

        setIsSubmitting(false);
        enableInputs();
      });
  };

  const onSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailErrorMessage("");
    setIsSubmitting(true);
    disableInputs();
    signIn();
  };

  useEffect(() => {
    if (email.length) {
      if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        emailRef.current?.setCustomValidity("Not a valid email address");
        setEmailErrorMessage("Not a valid email address");
      } else {
        emailRef.current?.setCustomValidity("");
        setEmailErrorMessage("");
      }
    } else {
      emailRef.current?.setCustomValidity("Please enter an email address");
      setEmailErrorMessage("Please enter an email address");
    }
  }, [email]);

  return (
    <div className={styles.formWrapper}>
      <h1>Log In</h1>

      <form onSubmit={onSubmitLogin}>
        <fieldset
          className={
            emailErrorMessage.length && reportEmailValidity
              ? styles.inputInvalid
              : reportEmailValidity
              ? styles.inputValid
              : undefined
          }
        >
          <input
            type="text"
            id="sign-up-email"
            value={email}
            placeholder=" "
            required
            ref={emailRef}
            onBlur={() => setReportEmailValidity(true)}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="sign-up-email">Email</label>
          <p>{reportEmailValidity && emailErrorMessage}</p>
        </fieldset>

        <fieldset
          className={
            emailErrorMessage === "Incorrect username or password"
              ? styles.inputInvalid
              : undefined
          }
        >
          <input
            type="password"
            id="sign-up-password"
            value={password}
            placeholder=" "
            required
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="sign-up-password">Password</label>
        </fieldset>

        <p className={styles.helper}>
          Forget your <span className={styles.fakeLink}>username</span> or{" "}
          <span className={styles.fakeLink}>password</span> ?
        </p>

        {!isSubmitting && (
          <button className={styles.submitBtn} type="submit">
            Log In
          </button>
        )}
      </form>

      {isSubmitting ? (
        <ImSpinner2 className={styles.submitSpinner} />
      ) : (
        <p className={styles.helper}>
          New to Re_edit?{" "}
          <button
            className={styles.fakeLink}
            onClick={() => dispatch(setSignUpMode())}
          >
            Sign Up
          </button>
        </p>
      )}
    </div>
  );
};

export default LogInForm;
