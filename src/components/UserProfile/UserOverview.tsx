import { useEffect, useState } from "react";
import PostsOverview from "../Posts/PostsOverview";
import PostSorting from "../Posts/PostsSorting";
import { getPosts } from "../../functions/getPosts";
import { Post, UserProfile } from "../../ts_common/interfaces";
import { INITIAL_POST_DATA } from "../../ts_common/initialStates";
import styles from "../../styles/userProfile/UserOverview.module.css";

interface Props {
  userInfo: UserProfile;
}

const UserOverView = ({ userInfo }: Props) => {
  const [userPosts, setUserPosts] = useState<Array<Post>>([INITIAL_POST_DATA]);
  const [order, setOrder] = useState<"timestamp" | "upvotes">("timestamp");

  useEffect(() => {
    getPosts("authorId", userInfo.uid, order).then((posts) =>
      setUserPosts(posts)
    );
  }, [userInfo, order]);

  return (
    <div className={styles.root}>
      <PostSorting setOrder={setOrder} order={order} />
      <PostsOverview posts={userPosts} />
    </div>
  );
};

export default UserOverView;
