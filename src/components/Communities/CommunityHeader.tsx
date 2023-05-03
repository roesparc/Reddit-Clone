import { BsBell } from "react-icons/bs";
import styles from "../../styles/communities/CommunityHeader.module.css";
import { Community } from "../../ts_common/interfaces";
import LoadingCommunityHeader from "./LoadingCommunityHeader";

interface Props {
  subInfo: Community | undefined;
}

const CommunityHeader = ({ subInfo }: Props) => {
  return (
    <>
      {!subInfo?.name.length ? (
        <LoadingCommunityHeader />
      ) : (
        <div>
          <img
            src={subInfo?.coverImg}
            alt="Cover"
            className={styles.coverImg}
          />

          <div className={styles.infoWrapper}>
            <div className={styles.infoContainer}>
              <img src={subInfo?.img} alt="Main" />

              <div className={styles.titleContainer}>
                <div>
                  <h1>{subInfo?.name}</h1>
                  <h2>r/{subInfo?.name}</h2>
                </div>

                <div>
                  <button className={styles.notificationBtn}>
                    <BsBell />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityHeader;
