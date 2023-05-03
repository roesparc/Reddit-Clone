import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import styles from "../../styles/posts/CreatePostInput.module.css";

const CreatePostInput = () => {
  const userProfile = useAppSelector(selectUserProfile);
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <Link to={`/user/${userProfile.username}`}>
        <img src={userProfile.userImg} alt="User" />
      </Link>

      <input
        type="text"
        placeholder="Create Post"
        onClick={() => navigate("submit")}
      />
    </div>
  );
};

export default CreatePostInput;
