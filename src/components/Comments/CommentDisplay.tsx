import getElapsedtime from "../../functions/getElapsedTime";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { FaRegCommentAlt } from "react-icons/fa";
import { Comment, Post } from "../../ts_common/interfaces";
import { Link } from "react-router-dom";
import styles from "../../styles/comments/CommentDisplay.module.css";
import useCommentInteractions from "../../functions/commentInteractions";
import CommentInput from "./CommentInput";
import { useFetchComments } from "../../functions/fetchComments";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";

interface Props {
  comment: Comment;
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post>>;
  isReply: boolean;
}

const CommentDisplay = ({ comment, setPost, isReply, post }: Props) => {
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const { comments, setComments, isLoading } = useFetchComments(
    "parentCommentId",
    comment.commentId!,
    "timestamp",
    true
  );
  const {
    isCommentUpvoted,
    isCommentDownvoted,
    upvoteCount,
    downvoteCount,
    upvoteComment,
    downvoteComment,
  } = useCommentInteractions(comment);

  const getVotesClasses = () => {
    const classes = [styles.votesContainer];

    if (isCommentUpvoted) classes.push(styles.upvoted);
    if (isCommentDownvoted) classes.push(styles.downvoted);

    return classes.join(" ");
  };

  return (
    <div
      className={styles.root}
      style={isReply ? { paddingLeft: "24px" } : undefined}
    >
      <div
        className={styles.threadContainer}
        style={isReply ? { marginLeft: "13px" } : undefined}
      >
        <i></i>
      </div>

      <div
        className={styles.commentWrapper}
        style={isReply ? { marginTop: "unset" } : undefined}
      >
        <Link to={`/user/${comment.authorUsername}`} className={styles.ImgLink}>
          <img src={comment.authorImg} alt="Author" />
        </Link>

        <div className={styles.commentContainer}>
          <div className={styles.commentInfo}>
            <Link to={`/user/${comment.authorUsername}`}>
              {comment.authorUsername}
            </Link>{" "}
            {comment.authorId === comment.postAuthorId && <span>OP</span>} •{" "}
            {getElapsedtime(comment.timestamp?.toMillis() ?? 0)}
          </div>

          <p className={styles.commentBody}>{comment.body}</p>

          <div className={styles.interactionsContainer}>
            <div className={getVotesClasses()}>
              <button
                className={styles.upvoteBtn}
                onClick={() => upvoteComment()}
              >
                <TbArrowBigUp
                  viewBox="1.5 1.8 20 20"
                  style={{ strokeWidth: 1.5 }}
                />
              </button>
              <p>{upvoteCount - downvoteCount}</p>
              <button
                className={styles.downvoteBtn}
                onClick={() => downvoteComment()}
              >
                <TbArrowBigDown
                  viewBox="1.5 1.8 20 20"
                  style={{ strokeWidth: 1.5 }}
                />
              </button>
            </div>

            {!isReply && (
              <button onClick={() => setShowReplyInput((prev) => !prev)}>
                <FaRegCommentAlt /> Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {showReplyInput && (
        <CommentInput
          parentCommentId={comment.commentId}
          post={post}
          setPost={setPost}
          setComments={setComments}
          setShowReplyInput={setShowReplyInput}
        />
      )}

      {isLoading && !isReply && (
        <ImSpinner2 className={styles.loadingSpinner} />
      )}

      {comments.map((comment) => (
        <CommentDisplay
          key={comment.commentId}
          comment={comment}
          setPost={setPost}
          isReply={true}
          post={post}
        />
      ))}
    </div>
  );
};

export default CommentDisplay;
