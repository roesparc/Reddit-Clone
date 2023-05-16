import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import styles from "../../styles/posts/LoadingPosts.module.css";

interface Props {
  posts: Array<number>;
}

const LoadingPosts = ({ posts }: Props) => {
  return (
    <div>
      {posts.map((post) => (
        <div
          key={post}
          className={styles.root}
          style={posts.length === 1 ? { marginBottom: "unset" } : undefined}
        >
          <div className={styles.votesContainer}>
            <button>
              <TbArrowBigUp
                viewBox="1.5 1.8 20 20"
                style={{ strokeWidth: 1.5 }}
              />
            </button>
            <div></div>
            <button>
              <TbArrowBigDown
                viewBox="1.5 1.8 20 20"
                style={{ strokeWidth: 1.5 }}
              />
            </button>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.postInfo}></div>
            <div className={styles.title}></div>
            <div className={styles.content}></div>
            <div className={styles.interactionsContainer}>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingPosts;
