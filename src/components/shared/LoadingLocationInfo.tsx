import styles from "../../styles/shared/LocationInfo.module.css";

interface Props {
  responsiveShown?: boolean;
}

const LoadingLocationInfo = ({ responsiveShown }: Props) => {
  return (
    <div
      className={`${styles.root} ${responsiveShown && styles.responsiveShown}`}
    >
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
