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

  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
    useState<boolean>(false);

  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [confirmPasswordMessage, setConfirmPasswordMessage] =
    useState<string>("");

  const checkUsernameAvailable = useCallback(async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      usernameRef.current?.setCustomValidity("Username is not available");
      setUsernameMessage("Username is not available");
      setIsUsernameValid(false);
    } else {
      usernameRef.current?.setCustomValidity("");
      setUsernameMessage("Username is available");
      setIsUsernameValid(true);
    }
  }, [username]);

  const storeUserInFirestore = async (userCredential: UserCredential) => {
    const avatarUrl = await getDownloadURL(
      ref(storage, "misc/avatar_default.png")
    );

    setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      username: username,
      displayName: username,
      about: "",
      userImg: avatarUrl,
      userTheme: currentTheme,
      cakeDay: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });
  };

  const createUser = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        storeUserInFirestore(userCredential);
        dispatch(closeAuthModal());
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          emailRef.current?.setCustomValidity("Email already in use");
          setEmailMessage("Email already in use");
          setIsEmailValid(false);
        }
      });
  };

  const blurOnEnterAndSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const form = e.currentTarget.form;

      e.currentTarget.blur();

      setTimeout(() => {
        form?.dispatchEvent(new Event("submit", { bubbles: true }));
      }, 0);
    }
  };

  const onSubmitSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser();
  };

  useEffect(() => {
    if (username.length) {
      if (username.length < 3 || username.length > 20) {
        usernameRef.current?.setCustomValidity(
          "Username must be between 3 and 20 characters"
        );
        setUsernameMessage("Username must be between 3 and 20 characters");
        setIsUsernameValid(false);
      } else {
        usernameRef.current?.setCustomValidity("Cheking Username...");
        setUsernameMessage("");
        checkUsernameAvailable();
      }
    } else {
      setIsUsernameValid(false);
    }
  }, [username, checkUsernameAvailable]);

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

  useEffect(() => {
    if (password.length) {
      if (password.length < 8) {
        passwordRef.current?.setCustomValidity(
          "Password must be at least 8 characters long"
        );
        setPasswordMessage("Password must be at least 8 characters long");
        setIsPasswordValid(false);
      } else {
        passwordRef.current?.setCustomValidity("");
        setPasswordMessage("");
        setIsPasswordValid(true);
      }
    } else {
      setIsPasswordValid(false);
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword.length) {
      if (password !== confirmPassword) {
        confirmPasswordRef.current?.setCustomValidity("Passwords do not match");
        setConfirmPasswordMessage("Passwords do not match");
        setIsConfirmPasswordValid(false);
      } else {
        confirmPasswordRef.current?.setCustomValidity("");
        setConfirmPasswordMessage("");
        setIsConfirmPasswordValid(true);
      }
    } else {
      setIsConfirmPasswordValid(false);
    }
  }, [password, confirmPassword]);

  return (
    <div className={styles.formWrapper}>
      <h1>Sign Up</h1>

      <form onSubmit={onSubmitSignUp}>
        <fieldset
          className={
            !isUsernameValid && usernameMessage.length
              ? styles.inputInvalid
              : isUsernameValid
              ? styles.inputValid
              : undefined
          }
        >
          <input
            type="text"
            id="sign-up-username"
            placeholder=" "
            required
            ref={usernameRef}
            onBlur={(e) => setUsername(e.target.value)}
            onKeyDown={blurOnEnterAndSubmit}
          />
          <label htmlFor="sign-up-username">Username</label>
          <p>{usernameMessage}</p>
        </fieldset>

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
            onKeyDown={blurOnEnterAndSubmit}
          />
          <label htmlFor="sign-up-email">Email</label>
          <p>{emailMessage}</p>
        </fieldset>

        <fieldset
          className={
            !isPasswordValid && passwordMessage.length
              ? styles.inputInvalid
              : isPasswordValid
              ? styles.inputValid
              : undefined
          }
        >
          <input
            type="password"
            id="sign-up-password"
            placeholder=" "
            required
            ref={passwordRef}
            onBlur={(e) => setPassword(e.target.value)}
            onKeyDown={blurOnEnterAndSubmit}
          />
          <label htmlFor="sign-up-password">Password</label>
          <p>{passwordMessage}</p>
        </fieldset>

        <fieldset
          className={
            !isConfirmPasswordValid && confirmPasswordMessage.length
              ? styles.inputInvalid
              : isConfirmPasswordValid
              ? styles.inputValid
              : undefined
          }
        >
          <input
            type="password"
            id="sign-up-confirm-password"
            placeholder=" "
            required
            ref={confirmPasswordRef}
            onBlur={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={blurOnEnterAndSubmit}
          />
          <label htmlFor="sign-up-confirm-password">Confirm Password</label>
          <p>{confirmPasswordMessage}</p>
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
