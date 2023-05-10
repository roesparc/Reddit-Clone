import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import PostsOverview from "../Posts/PostsOverview";
import { useParams } from "react-router-dom";
import AccessDenied from "../shared/AccessDenied";
import { useFetchInteractionPosts } from "../../functions/fetchPosts";
import styles from "../../styles/shared/SharedPostsContainer.module.css";
import NothingToShow from "../shared/NothingToShow";
import LoadingPosts from "../Posts/LoadingPosts";
import { ImSpinner2 } from "react-icons/im";

interface Props {
  interactionType: "upvotedPosts" | "downvotedPosts" | "savedPosts";
}

const UserInteractionPosts = ({ interactionType }: Props) => {
  const { username } = useParams();
  const userProfile = useAppSelector(selectUserProfile);
  const { posts, isLoading, hasMore, isCollectionEmpty } =
    useFetchInteractionPosts(interactionType);

  return (
    <div className={styles.root}>
      {username === userProfile.username ? (
        isCollectionEmpty ? (
          <NothingToShow />
        ) : (
          <>
            <PostsOverview posts={posts} />

            {!posts.length && <LoadingPosts posts={[1, 2, 3]} />}

            {posts.length > 0 && isLoading && (
              <ImSpinner2 className={styles.loadingPostsSpinner} />
            )}

            {!hasMore && posts.length >= 9 && (
              <p className={styles.noMorePosts}>No more posts</p>
            )}
          </>
        )
      ) : (
        <AccessDenied />
      )}
    </div>
  );
};

export default UserInteractionPosts;
