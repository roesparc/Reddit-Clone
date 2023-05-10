import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { Comment } from "../../ts_common/interfaces";
import { FaRegCommentAlt } from "react-icons/fa";
import getElapsedtime from "../../functions/getElapsedTime";
import styles from "../../styles/comments/UserComments.module.css";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import { useState } from "react";
import deleteComment from "../../functions/deleteComment";

interface CommentProps {
  comment: Comment;
  navigate: NavigateFunction;
}

const CommentDisplay = ({ comment, navigate }: CommentProps) => {
  const userProfile = useAppSelector(selectUserProfile);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  return (
    <div
      className={styles.comment}
      onClick={(e) => {
        if (
          (e.target as HTMLElement).tagName !== "A" &&
          !(e.target as HTMLElement).closest("button")
        ) {
          navigate(`/r/${comment.subName}/${comment.postId}`);
        }
      }}
    >
      <div className={styles.commentInfo}>
        <FaRegCommentAlt />
        <Link to={`/user/${comment.authorUsername}`}>
          {comment.authorUsername}
        </Link>
        <p>commented on</p>
        <Link to={`/r/${comment.subName}/${comment.postId}`}>
          {comment.postTitle}
        </Link>
        •<Link to={`/r/${comment.subName}`}>r/{comment.subName}</Link>
      </div>

      <div className={styles.contentWrapper}>
        <div></div>

        {isDeleted ? (
          <div className={styles.commentInfoInner}>
            <p>Comment deleted by user</p>
          </div>
        ) : (
          <div>
            <div className={styles.commentInfoInner}>
              <Link to={`/user/${comment.authorUsername}`}>
                {comment.authorUsername}
              </Link>
              {comment.authorId === comment.postAuthorId && <span>OP</span>}
              <p>
                {comment.upvotes - comment.downvotes}{" "}
                {comment.upvotes - comment.downvotes === 1 ||
                comment.upvotes - comment.downvotes === -1
                  ? "point"
                  : "points"}
              </p>
              • {getElapsedtime(comment.timestamp?.toMillis() ?? 0)}
            </div>

            <div>
              <p className={styles.commentBody}>{comment.body}</p>

              <div className={styles.buttonsContainer}>
                {comment.authorId === userProfile.uid && (
                  <button onClick={() => deleteComment(comment, setIsDeleted)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface UserCommentsProps {
  comments: Array<Comment>;
}

const UserComments = ({ comments }: UserCommentsProps) => {
  const navigate = useNavigate();

  return (
    <div>
      {comments.map((comment) => (
        <CommentDisplay
          key={comment.commentId}
          comment={comment}
          navigate={navigate}
        />
      ))}
    </div>
  );
};

export default UserComments;
