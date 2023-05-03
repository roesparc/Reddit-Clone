import { useEffect, useState } from "react";
import PostsOverview from "../Posts/PostsOverview";
import PostSorting from "../Posts/PostsSorting";
import { UserProfile } from "../../ts_common/interfaces";
import styles from "../../styles/shared/SharedPostsContainer.module.css";
import { useParams } from "react-router-dom";
import { useFetchPosts } from "../../functions/fetchPosts";
import NothingToShow from "../shared/NothingToShow";
import { ImSpinner2 } from "react-icons/im";

interface Props {
  userInfo: UserProfile;
}

const UserOverView = ({ userInfo }: Props) => {
  const { username } = useParams();
  const [order, setOrder] = useState<"timestamp" | "upvotes">("timestamp");
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const { posts, isLoading, hasMore, isCollectionEmpty } = useFetchPosts(
    "authorId",
    userInfo.uid,
    order,
    shouldFetch
  );

  useEffect(() => {
    if (username === userInfo.username) setShouldFetch(true);
  }, [userInfo, username, order]);

  return (
    <div className={styles.root}>
      {isCollectionEmpty ? (
        <NothingToShow />
      ) : (
        <>
          <PostSorting setOrder={setOrder} order={order} />
          <PostsOverview posts={posts} />

          {posts.length > 0 && isLoading && (
            <ImSpinner2 className={styles.loadingPostsSpinner} />
          )}

          {!hasMore && posts.length >= 9 && (
            <p className={styles.noMorePosts}>No more posts</p>
          )}
        </>
      )}
    </div>
  );
};

export default UserOverView;
