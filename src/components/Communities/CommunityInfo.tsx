import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/communities/CommunityInfo.module.css";
import locationInfoStyles from "../../styles/shared/LocationInfo.module.css";
import { Community } from "../../ts_common/interfaces";
import LoadingLocationInfo from "../shared/LoadingLocationInfo";

interface Props {
  subInfo: Community;
}

const CommunityInfo = ({ subInfo }: Props) => {
  const { subName, postId } = useParams();
  const navigate = useNavigate();

  return (
    <>
      {!subInfo.id.length || subName !== subInfo.name ? (
        <LoadingLocationInfo />
      ) : (
        <div
          className={locationInfoStyles.root}
          style={{ padding: "unset", cursor: postId ? "pointer" : "initial" }}
          onClick={() => postId && navigate(`/r/${subName}`)}
        >
          <h3 className={styles.aboutCommunity}>About Community</h3>

          <div style={{ padding: "12px" }}>
            <div className={styles.infoContainer}>
              <img src={subInfo.img} alt="Main" />
              <h2>r/{subInfo.name}</h2>
            </div>

            <p className={styles.description}>{subInfo.description}</p>

            <hr className={styles.hr} />

            <div>
              <div className={styles.extraInfo}>
                <p>{subInfo.postNumber}</p>
                <p>Post Number</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityInfo;
