import getElapsedtime from "../../functions/getElapsedTime";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { FaRegCommentAlt } from "react-icons/fa";
import { Comment } from "../../ts_common/interfaces";
import { Link } from "react-router-dom";
import styles from "../../styles/comments/CommentDisplay.module.css";

interface Props {
  comment: Comment;
}

const CommentDisplay = ({ comment }: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.threadContainer}>
        <i></i>
      </div>

      <div className={styles.commentWrapper}>
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
            <div className={styles.votesContainer}>
              <button
              // onClick={() => interactionClick("upvote")}
              >
                <TbArrowBigUp
                  viewBox="1.5 1.8 20 20"
                  style={{ strokeWidth: 1.5 }}
                />
              </button>
              <p>5</p>
              <button
              // onClick={() => interactionClick("downvote")}
              >
                <TbArrowBigDown
                  viewBox="1.5 1.8 20 20"
                  style={{ strokeWidth: 1.5 }}
                />
              </button>
            </div>

            <button>
              <FaRegCommentAlt /> Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDisplay;
