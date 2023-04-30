import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import PostsOverview from "../Posts/PostsOverview";
import { useParams } from "react-router-dom";
import AccessDenied from "../shared/AccessDenied";
import { useFetchInteractionPosts } from "../../functions/fetchPosts";
import styles from "../../styles/posts/SharedPostsContainer.module.css";
import NothingToShow from "../shared/NothingToShow";

interface Props {
  interactionType: "upvotedPosts" | "downvotedPosts" | "savedPosts";
}

const UserInteractionPosts = ({ interactionType }: Props) => {
  const { username } = useParams();
  const userProfile = useAppSelector(selectUserProfile);
  const {
    posts,
    hasMore,
    isLoading,
    isCollectionEmpty,
    fetchInteractionPosts,
  } = useFetchInteractionPosts(interactionType);

  useEffect(() => {
    if (posts.length === 0) fetchInteractionPosts();
  }, [fetchInteractionPosts, posts]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight &&
        hasMore &&
        !isLoading
      ) {
        fetchInteractionPosts();
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, isLoading, fetchInteractionPosts]);

  return (
    <div className={styles.root}>
      {username === userProfile.username ? (
        isCollectionEmpty ? (
          <NothingToShow />
        ) : (
          <PostsOverview posts={posts} />
        )
      ) : (
        <AccessDenied />
      )}

      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default UserInteractionPosts;
