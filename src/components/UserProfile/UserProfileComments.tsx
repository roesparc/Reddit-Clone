import { useParams } from "react-router-dom";
import { UserProfile } from "../../ts_common/interfaces";
import { useEffect, useState } from "react";
import { useFetchComments } from "../../hooks/useFetchComments";
import styles from "../../styles/shared/SharedPostsContainer.module.css";
import UserComments from "../Comments/UserComments";
import LoadingComments from "../Comments/LoadingComments";
import NothingToShow from "../shared/NothingToShow";
import { ImSpinner2 } from "react-icons/im";

interface Props {
  userInfo: UserProfile;
}

const UserProfileComments = ({ userInfo }: Props) => {
  const { username } = useParams();
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [order] = useState<"timestamp" | "upvotes">("timestamp");
  const { comments, isLoading, hasMore, isCollectionEmpty } = useFetchComments(
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
          <UserComments comments={comments} />

          {!comments.length && <LoadingComments />}

          {comments.length > 0 && isLoading && (
            <ImSpinner2 className={styles.loadingPostsSpinner} />
          )}

          {!hasMore && comments.length >= 11 && (
            <p className={styles.noMorePosts}>No more comments</p>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfileComments;
