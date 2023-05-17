import { Link, useParams } from "react-router-dom";
import styles from "../../styles/userProfile/UserProfileNav.module.css";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";

interface Props {
  currentTab: string;
  responsive?: boolean;
}

const UserProfileNav = ({ currentTab, responsive }: Props) => {
  const { username } = useParams();
  const userProfile = useAppSelector(selectUserProfile);

  return (
    <div
      className={`${styles.root} ${responsive && styles.responsive} ${
        username === userProfile.username && styles.userProfile
      }`}
    >
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
  );
};

export default UserProfileNav;
