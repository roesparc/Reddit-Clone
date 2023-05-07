import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import getElapsedtime from "../../functions/getElapsedTime";
import { FaRegCommentAlt } from "react-icons/fa";
import { BsBookmark, BsBookmarkCheckFill } from "react-icons/bs";
import styles from "../../styles/posts/PostDisplay.module.css";
import usePostInteractions from "../../functions/PostInteractions";
import { Post } from "../../ts_common/interfaces";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Props {
  post: Post;
  mode?: "single";
}

const PostDisplay = ({ post, mode }: Props) => {
  const navigate = useNavigate();
  const { subName } = useParams();
  const {
    isPostUpvoted,
    isPostDownvoted,
    isPostSaved,
    upvoteCount,
    downvoteCount,
    upvotePost,
    downvotePost,
    savePost,
  } = usePostInteractions(post);

  const interactionClick = (type: string) => {
    type === "upvote" && upvotePost();
    type === "downvote" && downvotePost();
    type === "save" && savePost();
  };

  const getRootClasses = () => {
    const classes = [styles.root];

    if (mode === "single") classes.push(styles.singlePost);
    if (isPostUpvoted) classes.push(styles.upvoted);
    if (isPostDownvoted) classes.push(styles.downvoted);

    return classes.join(" ");
  };

  return (
    <div
      className={getRootClasses()}
      onClick={(e) => {
        if (
          (e.target as HTMLElement).tagName !== "A" &&
          !(e.target as HTMLElement).closest("button")
        ) {
          navigate(`/r/${post.subName}/${post.postId}`);
        }
      }}
    >
      <div className={styles.votesContainer}>
        <button
          className={styles.upvoteBtn}
          onClick={() => interactionClick("upvote")}
        >
          <TbArrowBigUp viewBox="1.5 1.8 20 20" style={{ strokeWidth: 1.5 }} />
        </button>
        <p className={styles.upvoteCount}>{upvoteCount - downvoteCount}</p>
        <button
          className={styles.downvoteBtn}
          onClick={() => interactionClick("downvote")}
        >
          <TbArrowBigDown
            viewBox="1.5 1.8 20 20"
            style={{ strokeWidth: 1.5 }}
          />
        </button>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.postInfo}>
          {!subName && <img src={post.subImg} alt={post.subName} />}
          {!subName && (
            <span>
              <Link to={`/r/${post.subName}`} className={styles.subName}>
                r/{post.subName}
              </Link>{" "}
              •
            </span>
          )}{" "}
          <span className={`${!subName ? styles.hideAuthor : ""}`}>
            Posted by{" "}
            <Link to={`/user/${post.authorUsername}`}>
              u/{post.authorUsername}
            </Link>{" "}
          </span>
          {getElapsedtime(post.timestamp?.toMillis() ?? 0)}
        </div>

        {mode === "single" ? (
          <h3>{post.title}</h3>
        ) : (
          <Link
            to={`/r/${post.subName}/${post.postId}`}
            className={styles.postLink}
          >
            <h3>{post.title}</h3>
          </Link>
        )}

        {mode === "single" && post.body ? (
          <p className={styles.postBody}>{post.body}</p>
        ) : (
          post.body && (
            <Link
              to={`/r/${post.subName}/${post.postId}`}
              className={styles.postLink}
            >
              <p className={styles.postBody}>{post.body}</p>
            </Link>
          )
        )}

        {post.img && (
          <img src={post.img} alt={post.title} className={styles.postImg} />
        )}

        <div className={styles.interactionsContainer}>
          <Link to={`/r/${post.subName}/${post.postId}`}>
            <button className={styles.commentsBtn}>
              <FaRegCommentAlt />
              {post.commentNumber}{" "}
              {post.commentNumber === 1 ? "Comment" : "Comments"}
            </button>
          </Link>

          {isPostSaved ? (
            <button onClick={() => interactionClick("save")}>
              <BsBookmarkCheckFill />
              Unsave
            </button>
          ) : (
            <button onClick={() => interactionClick("save")}>
              <BsBookmark />
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDisplay;
