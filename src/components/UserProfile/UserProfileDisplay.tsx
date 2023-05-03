import { useLocation, useParams } from "react-router-dom";
import styles from "../../styles/shared/LocationMainContent.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import UserOverView from "./UserOverview";
import UserInfo from "./UserInfo";
import { INITIAL_USER_PROFILE } from "../../ts_common/initialStates";
import { UserProfile } from "../../ts_common/interfaces";
import UserProfileNav from "./UserProfileNav";
import UserInteractionPosts from "./UserInteractionPosts";
import UserProfileComments from "./UserProfileComments";
import UserNotFound from "./UserNotFound";

const UserProfileDisplay = () => {
  const { username } = useParams();
  const location = useLocation();

  const [userExist, setUserExist] = useState<boolean>(true);
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
        setUserExist(true);
        setUserInfo(usernameQuerySnapshot.docs[0].data() as UserProfile);
      } else {
        setUserExist(false);
      }
    };
    getUserId();
  }, [username]);

  return (
    <>
      {userExist ? (
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
            {currentTab === "comments" && (
              <UserProfileComments userInfo={userInfo} />
            )}

            <UserInfo userInfo={userInfo} />
          </div>
        </div>
      ) : (
        <UserNotFound />
      )}
    </>
  );
};

export default UserProfileDisplay;
