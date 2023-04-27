import { Link, useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import styles from "../../styles/userProfile/UserProfile.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import UserOverView from "./UserOverview";
import UserInfo from "./UserInfo";
import { INITIAL_USER_PROFILE } from "../../ts_common/initialStates";
import { UserProfile } from "../../ts_common/interfaces";

const UserProfileDisplay = () => {
  const { username } = useParams();
  const location = useLocation();
  const userProfile = useAppSelector(selectUserProfile);

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
      <div className={styles.userProfileNav}>
        <Link
          to={`/user/${username}`}
          className={currentTab === username ? styles.activeTab : ""}
        >
          Overview
        </Link>
        <Link
          to={`/user/${username}/comments`}
          className={currentTab === "comments" ? styles.activeTab : ""}
        >
          Comments
        </Link>
        {username === userProfile.username && (
          <>
            <Link
              to={`/user/${username}/saved`}
              className={currentTab === "saved" ? styles.activeTab : ""}
            >
              Saved
            </Link>
            <Link
              to={`/user/${username}/upvoted`}
              className={currentTab === "upvoted" ? styles.activeTab : ""}
            >
              Upvoted
            </Link>
            <Link
              to={`/user/${username}/downvoted`}
              className={currentTab === "downvoted" ? styles.activeTab : ""}
            >
              Downvoted
            </Link>
          </>
        )}
      </div>

      <div className={styles.contentWrapper}>
        {currentTab === username && <UserOverView userInfo={userInfo} />}

        <UserInfo userInfo={userInfo} />
      </div>
    </div>
  );
};

export default UserProfileDisplay;
