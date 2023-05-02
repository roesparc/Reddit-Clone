import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import { TbCameraPlus } from "react-icons/tb";
import { ImSpinner2 } from "react-icons/im";
import styles from "../../styles/userProfile/UserSettings.module.css";
import btnStyles from "../../styles/elements/buttons.module.css";
import { useState } from "react";
import { db } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { FaCheck } from "react-icons/fa";
import updateUserImg from "../../functions/updateUserImg";

const UserSettings = () => {
  const userProfile = useAppSelector(selectUserProfile);
  const [showAvatarImgSpinner, setShowAvatarImgSpinner] =
    useState<boolean>(false);
  const [showCoverImgSpinner, setShowCoverImgSpinner] =
    useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(
    userProfile.displayName
  );
  const [about, setAbout] = useState<string>(userProfile.about);
  const [prevDisplayName, setPrevDisplayName] = useState<string>(
    userProfile.displayName
  );
  const [prevAbout, setPrevAbout] = useState<string>(userProfile.about);
  const [announceUpdate, setAnnounceUpdate] = useState<Array<string>>([]);

  const updateUserInfo = async (target: string) => {
    if (prevAbout === about && prevDisplayName === displayName) return;

    const userRef = doc(db, "users", userProfile.uid);
    await updateDoc(userRef, {
      [target]: target === "about" ? about : displayName,
    });

    setPrevAbout(about);
    setPrevDisplayName(displayName);

    setAnnounceUpdate((prev) => [...prev, "Changes saved"]);
    setTimeout(() => {
      setAnnounceUpdate((prev) => prev.slice(0, prev.length - 1));
    }, 3000);
  };

  return (
    <div className={styles.root}>
      <div>
        <h3 className={styles.userSettingsHeading}>User settings</h3>
        <div className={styles.navContainer}>
          <Link to="/settings/profile" className={styles.activeTab}>
            Profile
          </Link>
        </div>
      </div>

      <div className={styles.mainSettingsWrapper}>
        <div className={styles.mainSettingsContainer}>
          <h2 className={styles.sectionHeading}>Customize profile</h2>
          <h3>Profile Information</h3>

          <div className={styles.settingsSection}>
            <h3>Display name (optional)</h3>
            <p>Set a display name. This does not change your username.</p>

            <input
              type="text"
              value={displayName}
              placeholder="Display name (optional)"
              maxLength={30}
              onChange={(e) => setDisplayName(e.target.value)}
              onBlur={() => updateUserInfo("displayName")}
            />
            <p
              style={{
                color: displayName.length === 30 ? "#fb133a" : undefined,
              }}
            >
              {30 - displayName.length} Characters remaining
            </p>
          </div>

          <div className={styles.settingsSection}>
            <h3>About (optional)</h3>
            <p>A brief description of yourself shown on your profile.</p>

            <textarea
              value={about}
              rows={4}
              maxLength={200}
              placeholder="About (optional)"
              onChange={(e) => setAbout(e.target.value)}
              onBlur={() => updateUserInfo("about")}
            ></textarea>
            <p
              style={{
                color: about.length === 200 ? "#fb133a" : undefined,
              }}
            >
              {200 - about.length} Characters remaining
            </p>
          </div>

          <h3>Images</h3>

          <div className={styles.settingsSection}>
            <h3>Avatar and banner image</h3>
            <p>Images must be .png or .jpg format</p>

            <div className={styles.userImgsContainer}>
              <div className={styles.avatarImgContainer}>
                <img src={userProfile.userImg} alt="User" />
                <label className={btnStyles.cameraBtn}>
                  <TbCameraPlus />
                  <input
                    type="file"
                    onChange={(e) =>
                      updateUserImg(
                        e,
                        "userImg",
                        userProfile,
                        null,
                        setShowAvatarImgSpinner
                      )
                    }
                  />
                </label>
                {showAvatarImgSpinner && (
                  <ImSpinner2 className={styles.imgSpinner} />
                )}
              </div>

              <div className={styles.bannerImgContainer}>
                <img src={userProfile.coverImg} alt="Cover" />
                <label className={btnStyles.cameraBtn}>
                  <TbCameraPlus />
                  <input
                    type="file"
                    onChange={(e) =>
                      updateUserImg(
                        e,
                        "coverImg",
                        userProfile,
                        setShowCoverImgSpinner,
                        null
                      )
                    }
                  />
                </label>
                {showCoverImgSpinner && (
                  <ImSpinner2 className={styles.imgSpinner} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.announceUpdateContainer}>
        {announceUpdate.map((announce, index) => (
          <p key={index} className={styles.update}>
            {announce} <FaCheck />
          </p>
        ))}
      </div>
    </div>
  );
};

export default UserSettings;
