import { Link, useNavigate } from "react-router-dom";
import { Post } from "../../ts_common/interfaces";
import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import getElapsedtime from "../../functions/getElapsedTime";
import { FaRegCommentAlt } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import styles from "../../styles/posts/PostsOverview.module.css";

interface Props {
  posts: Array<Post>;
}

const PostsOverview = ({ posts }: Props) => {
  const navigate = useNavigate();

  return (
    <div>
      {posts.map((post) => (
        <div
          className={styles.root}
          onClick={() => navigate(`/r/${post.subName}/${post.postId}`)}
          key={post.postId}
        >
          <div className={styles.votesContainer}>
            <button>
              <TbArrowBigUp
                viewBox="1.5 1.8 20 20"
                style={{ strokeWidth: 1.5 }}
              />
            </button>
            <p>{post.upvotes - post.downvotes}</p>
            <button>
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
              <button>
                <BsBookmark />
                Save
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsOverview;
