import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import getElapsedtime from "../../functions/getElapsedTime";
import { FaCheck, FaRegCommentAlt } from "react-icons/fa";
import { BsBookmark, BsBookmarkCheckFill, BsTrash3 } from "react-icons/bs";
import styles from "../../styles/posts/PostDisplay.module.css";
import usePostInteractions from "../../hooks/usePostInteractions";
import { Post } from "../../ts_common/interfaces";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import { useEffect, useState, useRef } from "react";
import deletePost from "../../functions/deletePost";
import { ImSpinner2 } from "react-icons/im";
import {
  openAuthModal,
  setLogInMode,
} from "../../redux/features/userAuthModal";

interface Props {
  post: Post;
  mode?: "single";
  isPostDeleting?: boolean;
  setIsPostDeleting?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostDisplay = ({
  post,
  mode,
  isPostDeleting,
  setIsPostDeleting,
}: Props) => {
  const { subName } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(selectUserProfile);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [isPostDeleted, setIsPostDeleted] = useState<boolean>(false);
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

  const handlePostInteraction = (interactionFn: () => void) => {
    if (!userProfile.username) {
      dispatch(openAuthModal());
      dispatch(setLogInMode());
      return;
    }

    !isPostDeleted && interactionFn();
  };

  const getRootClasses = () => {
    const classes = [styles.root];

    if (mode === "single") classes.push(styles.singlePost);
    if (isPostUpvoted) classes.push(styles.upvoted);
    if (isPostDownvoted) classes.push(styles.downvoted);

    return classes.join(" ");
  };

  useEffect(() => {
    if (bodyRef.current && bodyRef.current.offsetHeight === 250) {
      bodyRef.current.classList.add(styles.mask);
    }
  }, [bodyRef]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPostDeleted) {
      timeout = setTimeout(() => {
        navigate("/");
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [isPostDeleted, navigate]);

  return (
    <div
      className={getRootClasses()}
      onClick={(e) => {
        if (
          !(e.target as HTMLElement).closest("a") &&
          !(e.target as HTMLElement).closest("button")
        ) {
          navigate(`/r/${post.subName}/${post.postId}`);
        }
      }}
    >
      <div className={styles.votesContainer}>
        <button
          className={styles.upvoteBtn}
          onClick={() => handlePostInteraction(upvotePost)}
        >
          <TbArrowBigUp viewBox="1.5 1.8 20 20" style={{ strokeWidth: 1.5 }} />
        </button>
        <p className={styles.upvoteCount}>{upvoteCount - downvoteCount}</p>
        <button
          className={styles.downvoteBtn}
          onClick={() => handlePostInteraction(downvotePost)}
        >
          <TbArrowBigDown
            viewBox="1.5 1.8 20 20"
            style={{ strokeWidth: 1.5 }}
          />
        </button>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.postInfo}>
          {!subName && (
            <>
              <Link to={`/r/${post.subName}`}>
                <img src={post.subImg} alt={post.subName} />
              </Link>
              <Link to={`/r/${post.subName}`} className={styles.subName}>
                r/{post.subName}
              </Link>{" "}
              •
            </>
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
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{post.title}</h3>
          </Link>
        )}

        {mode === "single" && post.body ? (
          <div className={styles.postBody}>{post.body}</div>
        ) : (
          post.body && (
            <Link
              to={`/r/${post.subName}/${post.postId}`}
              className={styles.postLink}
              onClick={(e) => e.stopPropagation()}
            >
              <div ref={bodyRef} className={styles.postBody}>
                {post.body}
              </div>
            </Link>
          )
        )}

        {post.img && (
          <img src={post.img} alt={post.title} className={styles.postImg} />
        )}

        <div
          className={styles.interactionsContainer}
          style={post.body && !mode ? { marginTop: "8px" } : undefined}
        >
          <Link to={`/r/${post.subName}/${post.postId}`}>
            <button className={styles.commentsBtn}>
              <FaRegCommentAlt />
              {post.commentNumber}{" "}
              {post.commentNumber === 1 ? "Comment" : "Comments"}
            </button>
          </Link>

          {isPostSaved ? (
            <button onClick={() => handlePostInteraction(savePost)}>
              <BsBookmarkCheckFill />
              Unsave
            </button>
          ) : (
            <button onClick={() => handlePostInteraction(savePost)}>
              <BsBookmark />
              Save
            </button>
          )}

          {post.authorId === userProfile.uid &&
            mode === "single" &&
            (isPostDeleting && !isPostDeleted ? (
              <ImSpinner2 className={styles.deletingSpinner} />
            ) : isPostDeleted ? (
              <span className={styles.postDeleted}>
                Deleted <FaCheck />
              </span>
            ) : (
              <button
                onClick={() => {
                  setIsPostDeleting!(true);
                  deletePost(post, setIsPostDeleted);
                }}
              >
                <BsTrash3 /> Delete
              </button>
            ))}
        </div>
      </div>

      {isPostDeleted && (
        <div className={styles.announceContainer}>
          <p className={styles.postDeletedAnnounce}>
            Post deleted successfully.
          </p>
        </div>
      )}
    </div>
  );
};

export default PostDisplay;
