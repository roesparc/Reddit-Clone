import { useEffect, useState } from "react";
import PostsOverview from "../Posts/PostsOverview";
import PostSorting from "../Posts/PostsSorting";
import { getPosts } from "../../functions/getPosts";
import { Post, UserProfile } from "../../ts_common/interfaces";
import { INITIAL_POST_DATA } from "../../ts_common/initialStates";
import styles from "../../styles/posts/SharedPostsContainer.module.css";
import { useParams } from "react-router-dom";

interface Props {
  userInfo: UserProfile;
}

const UserOverView = ({ userInfo }: Props) => {
  const { username } = useParams();
  const [userPosts, setUserPosts] = useState<Array<Post>>([INITIAL_POST_DATA]);
  const [order, setOrder] = useState<"timestamp" | "upvotes">("timestamp");

  useEffect(() => {
    if (username === userInfo.username)
      getPosts("authorId", userInfo.uid, order).then((posts) =>
        setUserPosts(posts)
      );
  }, [userInfo, username, order]);

  return (
    <div className={styles.root}>
      <PostSorting setOrder={setOrder} order={order} />
      <PostsOverview posts={userPosts} />
    </div>
  );
};

export default UserOverView;
