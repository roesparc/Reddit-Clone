import styles from "../../styles/communities/LoadingCommunityHeader.module.css";

const LoadingCommunityHeader = () => (
  <div>
    <div className={styles.coverImg}></div>

    <div className={styles.infoWrapper}>
      <div className={styles.infoContainer}>
        <div className={styles.mainImg}></div>

        <div className={styles.titleContainer}>
          <div className={styles.title}></div>
          <div className={styles.subtitle}></div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingCommunityHeader;
