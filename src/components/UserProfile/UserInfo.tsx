import { Link, useParams } from "react-router-dom";
import { selectUserProfile } from "../../redux/features/auth";
import { useAppSelector } from "../../redux/hooks";
import styles from "../../styles/userProfile/UserInfo.module.css";
import { TbCameraPlus } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineCake } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { UserProfile } from "../../ts_common/interfaces";
import btnStyles from "../../styles/elements/buttons.module.css";
import updateUserImg from "../../functions/updateUserImg";
import locationInfoStyles from "../../styles/shared/LocationInfo.module.css";
import LoadingLocationInfo from "../shared/LoadingLocationInfo";

interface Props {
  userInfo: UserProfile;
}

const UserInfo = ({ userInfo }: Props) => {
  const { username } = useParams();
  const userProfile = useAppSelector(selectUserProfile);
  const [showCoverImgSpinner, setShowCoverImgSpinner] =
    useState<boolean>(false);

  return (
    <>
      {!userInfo.uid.length || username !== userInfo.username ? (
        <LoadingLocationInfo />
      ) : (
        <div className={locationInfoStyles.root}>
          <div className={styles.coverImgContainer}>
            <img
              src={
                username === userProfile.username
                  ? userProfile.coverImg
                  : userInfo.coverImg
              }
              alt="cover"
            />
            {username === userProfile.username && (
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
            )}
            {showCoverImgSpinner && (
              <ImSpinner2 className={styles.coverImgSpinner} />
            )}
          </div>

          {username === userProfile.username && (
            <Link to="/settings/profile" className={styles.userSettingsBtn}>
              <IoSettingsOutline viewBox="20 20 480 480" />
            </Link>
          )}

          <div className={styles.userImgContainer}>
            <img src={userInfo.userImg} alt="user" />
          </div>

          <h1 className={styles.userDisplayName}>
            {userInfo.displayName || userInfo.username}
          </h1>

          <p className={styles.username}>u/{userInfo.username}</p>

          <p className={styles.about}>{userInfo.about}</p>

          <div className={styles.cakeDayContainer}>
            <h5>Cake Day</h5>
            <p>
              <MdOutlineCake />
              {userInfo.cakeDay}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
