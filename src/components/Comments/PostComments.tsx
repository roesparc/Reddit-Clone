import { useParams } from "react-router-dom";
import { useState } from "react";
import { useFetchComments } from "../../functions/fetchComments";
import CommentDisplay from "./CommentDisplay";
import styles from "../../styles/comments/PostComments.module.css";
import stylesShared from "../../styles/shared/SharedPostsContainer.module.css";
import LoadingComments from "./LoadingComments";
import { ImSpinner2 } from "react-icons/im";
import { IoMdChatbubbles } from "react-icons/io";
import CommentInput from "./CommentInput";

const PostComments = () => {
  const { postId } = useParams();
  const [order] = useState<"timestamp" | "upvotes">("timestamp");
  const { comments, isLoading, hasMore, isCollectionEmpty } = useFetchComments(
    "postId",
    postId!,
    order,
    true
  );

  return (
    <div className={styles.root}>
      <CommentInput />

      {isCollectionEmpty ? (
        <div className={styles.noCommentsContainer}>
          <IoMdChatbubbles />
          <p>No Comments Yet</p>
          <p>Be the first to share what you think!</p>
        </div>
      ) : !comments.length ? (
        <LoadingComments />
      ) : (
        <>
          <div className={styles.commentContainer}>
            {comments.map((comment) => (
              <CommentDisplay key={comment.commentId} comment={comment} />
            ))}
          </div>

          {isLoading && (
            <ImSpinner2
              className={stylesShared.loadingPostsSpinner}
              style={{ marginBottom: "16px" }}
            />
          )}

          {!hasMore && comments.length >= 9 && (
            <p
              className={stylesShared.noMorePosts}
              style={{ marginBottom: "16px" }}
            >
              No more comments
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default PostComments;
