import { useCallback, useEffect, useRef, useState } from "react";
import {
  closeAuthModal,
  setLogInMode,
} from "../../redux/features/userAuthModal";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UserCredential, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebase/config";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import styles from "../..//styles/userAuthModal/AuthFormsShared.module.css";
import { selectCurrentTheme } from "../../redux/features/theme";

const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(selectCurrentTheme);

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState<string>("");

  const [isUsernameAvailable, setIsUsernameAvailable] =
    useState<boolean>(false);

  const [reportUsernameValidity, setReportUsernameValidity] =
    useState<boolean>(false);
  const [reportEmailValidity, setReportEmailValidity] =
    useState<boolean>(false);
  const [reportPasswordValidity, setReportPasswordValidity] =
    useState<boolean>(false);
  const [reportConfirmPasswordValidity, setReportConfirmPasswordValidity] =
    useState<boolean>(false);

  const checkUsernameAvailable = useCallback(async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      usernameRef.current?.setCustomValidity("Username is not available");
      setUsernameErrorMessage("Username is not available");
      setIsUsernameAvailable(false);
    } else {
      usernameRef.current?.setCustomValidity("");
      setUsernameErrorMessage("");
      setIsUsernameAvailable(true);
    }
  }, [username]);

  const storeUserInFirestore = async (userCredential: UserCredential) => {
    const [avatarUrl, coverUrl] = await Promise.all([
      getDownloadURL(
        ref(
          storage,
          `misc/avatars/avatar_default_${Math.floor(Math.random() * 11)}.png`
        )
      ),
      getDownloadURL(ref(storage, "misc/cover_default.jpg")),
    ]);

    setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      username: username,
      displayName: username,
      about: "",
      userImg: avatarUrl,
      coverImg: coverUrl,
      userTheme: currentTheme,
      upvotedPosts: [],
      downvotedPosts: [],
      savedPosts: [],
      cakeDay: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });
  };

  const createUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        storeUserInFirestore(userCredential);
        dispatch(closeAuthModal());
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          emailRef.current?.setCustomValidity("Email already in use");
          setEmailErrorMessage("Email already in use");
        }
      });
  };

  const onSubmitSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser();
  };

  useEffect(() => {
    if (username.length < 3 || username.length > 20) {
      usernameRef.current?.setCustomValidity(
        "Username must be between 3 and 20 characters"
      );
      setUsernameErrorMessage("Username must be between 3 and 20 characters");
      setIsUsernameAvailable(false);
    } else {
      usernameRef.current?.setCustomValidity("Cheking Username...");
      setUsernameErrorMessage("");
      checkUsernameAvailable();
    }
  }, [username, checkUsernameAvailable]);

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

  useEffect(() => {
    if (password.length < 8) {
      passwordRef.current?.setCustomValidity(
        "Password must be at least 8 characters long"
      );
      setPasswordErrorMessage("Password must be at least 8 characters long");
    } else {
      passwordRef.current?.setCustomValidity("");
      setPasswordErrorMessage("");
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword.length) {
      if (password !== confirmPassword) {
        confirmPasswordRef.current?.setCustomValidity("Passwords do not match");
        setConfirmPasswordErrorMessage("Passwords do not match");
      } else {
        confirmPasswordRef.current?.setCustomValidity("");
        setConfirmPasswordErrorMessage("");
      }
    } else {
      confirmPasswordRef.current?.setCustomValidity("Confirm your password");
      setConfirmPasswordErrorMessage("Confirm your password");
    }
  }, [password, confirmPassword]);

  return (
    <div className={styles.formWrapper}>
      <h1>Sign Up</h1>

      <form onSubmit={onSubmitSignUp}>
        <fieldset
          className={
            usernameErrorMessage.length && reportUsernameValidity
              ? styles.inputInvalid
              : reportUsernameValidity
              ? styles.inputValid
              : undefined
          }
        >
          <input
            type="text"
            id="sign-up-username"
            value={username}
            placeholder=" "
            required
            ref={usernameRef}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => setReportUsernameValidity(true)}
          />
          <label htmlFor="sign-up-username">Username</label>
          <p>{reportUsernameValidity && usernameErrorMessage}</p>
          <p>
            {reportUsernameValidity &&
              isUsernameAvailable &&
              "Username is available"}
          </p>
        </fieldset>

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
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setReportEmailValidity(true)}
          />
          <label htmlFor="sign-up-email">Email</label>
          <p>{reportEmailValidity && emailErrorMessage}</p>
        </fieldset>

        <fieldset
          className={
            passwordErrorMessage.length && reportPasswordValidity
              ? styles.inputInvalid
              : reportPasswordValidity
              ? styles.inputValid
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
            onBlur={() => setReportPasswordValidity(true)}
          />
          <label htmlFor="sign-up-password">Password</label>
          <p>{reportPasswordValidity && passwordErrorMessage}</p>
        </fieldset>

        <fieldset
          className={
            confirmPasswordErrorMessage.length && reportConfirmPasswordValidity
              ? styles.inputInvalid
              : reportConfirmPasswordValidity
              ? styles.inputValid
              : undefined
          }
        >
          <input
            type="password"
            id="sign-up-confirm-password"
            value={confirmPassword}
            placeholder=" "
            required
            ref={confirmPasswordRef}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setReportConfirmPasswordValidity(true)}
          />
          <label htmlFor="sign-up-confirm-password">Confirm Password</label>
          <p>{reportConfirmPasswordValidity && confirmPasswordErrorMessage}</p>
        </fieldset>

        <button className={styles.submitBtn} type="submit">
          Sign Up
        </button>
      </form>

      <p className={styles.helper}>
        Already a re_editor?{" "}
        <button
          className={styles.fakeLink}
          onClick={() => dispatch(setLogInMode())}
        >
          Log In
        </button>
      </p>
    </div>
  );
};

export default SignUpForm;
