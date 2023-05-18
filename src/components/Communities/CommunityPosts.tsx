import CreatePostInput from "../Posts/CreatePostInput";
import styles from "../../styles/shared/SharedPostsContainer.module.css";
import PostSorting from "../Posts/PostsSorting";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Community } from "../../ts_common/interfaces";
import { useFetchPosts } from "../../hooks/useFetchPosts";
import PostsOverview from "../Posts/PostsOverview";
import NothingToShow from "../shared/NothingToShow";
import { ImSpinner2 } from "react-icons/im";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";

interface Props {
  subInfo: Community;
}

const CommunityPosts = ({ subInfo }: Props) => {
  const userProfile = useAppSelector(selectUserProfile);
  const { subName } = useParams();

  const [order, setOrder] = useState<"timestamp" | "upvotes">("timestamp");
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const { posts, isLoading, hasMore, isCollectionEmpty } = useFetchPosts(
    "subId",
    subInfo.id,
    order,
    shouldFetch
  );

  useEffect(() => {
    if (subName === subInfo.name) setShouldFetch(true);
    else setShouldFetch(false);
  }, [subName, subInfo, order]);

  return (
    <div className={styles.root}>
      {userProfile.username && <CreatePostInput />}

      {isCollectionEmpty ? (
        <NothingToShow />
      ) : (
        <>
          <PostSorting order={order} setOrder={setOrder} />
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

export default CommunityPosts;
