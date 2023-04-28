import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { Post } from "../../ts_common/interfaces";
import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import getElapsedtime from "../../functions/getElapsedTime";
import { FaRegCommentAlt } from "react-icons/fa";
import { BsBookmark, BsBookmarkCheckFill } from "react-icons/bs";
import styles from "../../styles/posts/PostsOverview.module.css";
import usePostInteractions from "../../functions/PostInteractions";

interface PostProps {
  post: Post;
  navigate: NavigateFunction;
}

const PostDisplay = ({ post, navigate }: PostProps) => {
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

  const interactionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: string
  ) => {
    e.stopPropagation();

    type === "upvote" && upvotePost();
    type === "downvote" && downvotePost();
    type === "save" && savePost();
  };

  const getRootClasses = () => {
    const classes = [styles.root];

    if (isPostUpvoted) classes.push(styles.upvoted);
    if (isPostDownvoted) classes.push(styles.downvoted);

    return classes.join(" ");
  };

  return (
    <div
      className={getRootClasses()}
      onClick={() => navigate(`/r/${post.subName}/${post.postId}`)}
    >
      <div className={styles.votesContainer}>
        <button
          className={styles.upvoteBtn}
          onClick={(e) => interactionClick(e, "upvote")}
        >
          <TbArrowBigUp viewBox="1.5 1.8 20 20" style={{ strokeWidth: 1.5 }} />
        </button>
        <p className={styles.upvoteCount}>{upvoteCount - downvoteCount}</p>
        <button
          className={styles.downvoteBtn}
          onClick={(e) => interactionClick(e, "downvote")}
        >
          <TbArrowBigDown
            viewBox="1.5 1.8 20 20"
            style={{ strokeWidth: 1.5 }}
          />
        </button>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.postInfo}>
          <img src={post.subImg} alt={post.subName} />
          <span>
            <Link
              to={`/r/${post.subName}`}
              onClick={(e) => e.stopPropagation()}
              className={styles.subName}
            >
              r/{post.subName}
            </Link>
          </span>{" "}
          <span className={styles.author}>
            • Posted by{" "}
            <Link
              to={`/user/${post.authorUsername}`}
              onClick={(e) => e.stopPropagation()}
            >
              u/{post.authorUsername}
            </Link>{" "}
          </span>
          {getElapsedtime(post.timestamp?.toMillis() ?? 0)}
        </div>

        <Link
          to={`/r/${post.subName}/${post.postId}`}
          onClick={(e) => e.stopPropagation()}
          className={styles.postLink}
        >
          <h3>{post.title}</h3>
        </Link>

        {post.body && (
          <Link
            to={`/r/${post.subName}/${post.postId}`}
            onClick={(e) => e.stopPropagation()}
            className={styles.postLink}
          >
            <p className={styles.postBody}>{post.body}</p>
          </Link>
        )}

        {post.img && (
          <img src={post.img} alt={post.title} className={styles.postImg} />
        )}

        <div className={styles.interactionsContainer}>
          <button>
            <FaRegCommentAlt />
            {post.commentNumber}{" "}
            {post.commentNumber === 1 ? "Comment" : "Comments"}
          </button>

          {isPostSaved ? (
            <button onClick={(e) => interactionClick(e, "save")}>
              <BsBookmarkCheckFill />
              Unsave
            </button>
          ) : (
            <button onClick={(e) => interactionClick(e, "save")}>
              <BsBookmark />
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface PostsOverviewProps {
  posts: Array<Post>;
}

const PostsOverview = ({ posts }: PostsOverviewProps) => {
  const navigate = useNavigate();

  return (
    <div>
      {posts.map((post) => (
        <PostDisplay key={post.postId} post={post} navigate={navigate} />
      ))}
    </div>
  );
};

export default PostsOverview;
