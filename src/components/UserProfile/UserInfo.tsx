import { Link, useParams } from "react-router-dom";
import { selectUserProfile } from "../../redux/features/auth";
import { useAppSelector } from "../../redux/hooks";
import styles from "../../styles/userProfile/UserInfo.module.css";
import { TbCameraPlus } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineCake } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { UserProfile } from "../../ts_common/interfaces";

interface Props {
  userInfo: UserProfile;
}

const UserInfo = ({ userInfo }: Props) => {
  const { username } = useParams();
  const userProfile = useAppSelector(selectUserProfile);
  const [showCoverImgSpinner, setShowCoverImgSpinner] =
    useState<boolean>(false);

  const updateCoverImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setShowCoverImgSpinner(true);

      const img = e.target.files[0];
      const imgRef = ref(storage, `users/${userProfile.uid}/cover`);

      await uploadBytes(imgRef, img);
      const imgUrl = await getDownloadURL(imgRef);

      const userRef = doc(db, "users", userProfile.uid);
      await updateDoc(userRef, { coverImg: imgUrl });

      setShowCoverImgSpinner(false);
    }
  };

  return (
    <div className={styles.root}>
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
          <label>
            <TbCameraPlus />
            <input type="file" onChange={(e) => updateCoverImg(e)} />
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

      <h1 className={styles.userDisplayName}>{userInfo.displayName}</h1>

      <p className={styles.username}>u/{userInfo.username}</p>

      <div className={styles.cakeDayContainer}>
        <h5>Cake Day</h5>
        <p>
          <MdOutlineCake />
          {userInfo.cakeDay}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
