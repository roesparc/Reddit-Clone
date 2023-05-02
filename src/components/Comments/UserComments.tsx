import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { Comment } from "../../ts_common/interfaces";
import { FaRegCommentAlt } from "react-icons/fa";
import getElapsedtime from "../../functions/getElapsedTime";
import styles from "../../styles/comments/UserComments.module.css";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useState } from "react";

interface CommentProps {
  comment: Comment;
  navigate: NavigateFunction;
}

const CommentDisplay = ({ comment, navigate }: CommentProps) => {
  const userProfile = useAppSelector(selectUserProfile);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const deleteComment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "comments", comment.commentId));
    setIsDeleted(true);
  };

  return (
    <div
      className={styles.comment}
      onClick={() => navigate(`/r/${comment.subName}/${comment.postId}`)}
    >
      <div className={styles.commentInfo}>
        <FaRegCommentAlt />
        <Link
          to={`/user/${comment.authorUsername}`}
          onClick={(e) => e.stopPropagation()}
        >
          {comment.authorUsername}
        </Link>
        <p>commented on</p>
        <Link to={`/r/${comment.subName}/${comment.postId}`}>
          {comment.postTitle}
        </Link>
        •
        <Link to={`/r/${comment.subName}`} onClick={(e) => e.stopPropagation()}>
          r/{comment.subName}
        </Link>
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
              <Link
                to={`/user/${comment.authorUsername}`}
                onClick={(e) => e.stopPropagation()}
              >
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
                  <button onClick={(e) => deleteComment(e)}>Delete</button>
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
