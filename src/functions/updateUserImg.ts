import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { UserProfile } from "../ts_common/interfaces";

const updateUserImg = async (
  e: React.ChangeEvent<HTMLInputElement>,
  type: string,
  userProfile: UserProfile,
  setShowCoverImgSpinner: React.Dispatch<React.SetStateAction<boolean>> | null,
  setShowAvatarImgSpinner: React.Dispatch<React.SetStateAction<boolean>> | null
) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024;
    if (
      file.size > maxSize ||
      (file.type !== "image/png" && file.type !== "image/jpeg")
    )
      return;

    type === "userImg"
      ? setShowAvatarImgSpinner!(true)
      : setShowCoverImgSpinner!(true);

    const img = e.target.files[0];
    const imgRef = ref(storage, `users/${userProfile.uid}/${type}`);

    await uploadBytes(imgRef, img);
    const imgUrl = await getDownloadURL(imgRef);

    const userRef = doc(db, "users", userProfile.uid);
    await updateDoc(userRef, { [type]: imgUrl });

    type === "userImg"
      ? setShowAvatarImgSpinner!(false)
      : setShowCoverImgSpinner!(false);
  }
};

export default updateUserImg;
