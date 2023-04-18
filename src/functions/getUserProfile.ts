import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { UserProfile } from "../ts_common/interfaces";
import { INITIAL_USER_PROFILE } from "../ts_common/initialStates";

const getUserProfile = async (currentUser: string | undefined) => {
  if (currentUser) {
    const docRef = doc(db, "users", currentUser);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
  }

  return INITIAL_USER_PROFILE;
};

export default getUserProfile;
