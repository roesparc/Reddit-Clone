import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import styles from "../../styles/comments/LoadingComments.module.css";

const LoadingComments = () => {
  const loadingComments = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div>
      {loadingComments.map((comment) => (
        <div key={comment} className={styles.root}>
          <div className={styles.commentInfo}></div>
          <div className={styles.commentBody}></div>
          <div className={styles.interactionsContainer}>
            <TbArrowBigUp
              viewBox="1.5 1.8 20 20"
              style={{ strokeWidth: 1.5 }}
            />
            <div className={styles.voteNumber}></div>
            <TbArrowBigDown
              viewBox="1.5 1.8 20 20"
              style={{ strokeWidth: 1.5 }}
            />
            <div className={styles.interactions}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingComments;
