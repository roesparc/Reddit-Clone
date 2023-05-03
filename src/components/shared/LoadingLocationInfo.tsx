import styles from "../../styles/shared/LocationInfo.module.css";

const LoadingLocationInfo = () => {
  return (
    <div className={styles.root}>
      <div className={styles.infoHeaderSkeleton}>
        <div className={styles.imgSkeleton}></div>
        <div className={styles.titleSkeleton}></div>
        <div className={styles.subtitleSkeleton}></div>
      </div>

      <div className={styles.firstPSkeleton}></div>

      <div className={styles.secondPSkeleton}></div>

      <div className={styles.utilsContainerSkeleton}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingLocationInfo;
