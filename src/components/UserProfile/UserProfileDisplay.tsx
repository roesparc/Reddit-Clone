import { useLocation, useParams } from "react-router-dom";
import styles from "../../styles/userProfile/UserProfileDisplay.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import UserOverView from "./UserOverview";
import UserInfo from "./UserInfo";
import { INITIAL_USER_PROFILE } from "../../ts_common/initialStates";
import { UserProfile } from "../../ts_common/interfaces";
import UserProfileNav from "./UserProfileNav";
import UserInteractionPosts from "./UserInteractionPosts";

const UserProfileDisplay = () => {
  const { username } = useParams();
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserProfile>(INITIAL_USER_PROFILE);

  useEffect(() => {
    const currentTab = location.pathname.split("/").pop();
    if (currentTab) setCurrentTab(currentTab);
  }, [location.pathname]);

  useEffect(() => {
    const getUserId = async () => {
      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", username),
        limit(1)
      );
      const usernameQuerySnapshot = await getDocs(usernameQuery);

      if (!usernameQuerySnapshot.empty) {
        setUserInfo(usernameQuerySnapshot.docs[0].data() as UserProfile);
      } else {
        // TODO: NO USER FOUND PAGE
      }
    };
    getUserId();
  }, [username]);

  return (
    <div>
      <UserProfileNav currentTab={currentTab} />

      <div className={styles.contentWrapper}>
        {currentTab === username && <UserOverView userInfo={userInfo} />}
        {currentTab === "upvoted" && (
          <UserInteractionPosts interactionType="upvotedPosts" />
        )}
        {currentTab === "downvoted" && (
          <UserInteractionPosts interactionType="downvotedPosts" />
        )}
        {currentTab === "saved" && (
          <UserInteractionPosts interactionType="savedPosts" />
        )}

        <UserInfo userInfo={userInfo} />
      </div>
    </div>
  );
};

export default UserProfileDisplay;
