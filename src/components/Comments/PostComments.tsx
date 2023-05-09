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
import { Post } from "../../ts_common/interfaces";

interface Props {
  setPost: React.Dispatch<React.SetStateAction<Post>>;
  post: Post;
}

const PostComments = ({ setPost, post }: Props) => {
  const { postId } = useParams();
  const [order] = useState<"timestamp" | "upvotes">("timestamp");
  const { comments, isLoading, hasMore, isCollectionEmpty, setComments } =
    useFetchComments("postId", postId!, order, true);

  return (
    <div className={styles.root}>
      <CommentInput post={post} setComments={setComments} setPost={setPost} />

      {isCollectionEmpty && !comments.length ? (
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
              <CommentDisplay
                key={comment.commentId}
                comment={comment}
                post={post}
                setPost={setPost}
                isReply={false}
              />
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
