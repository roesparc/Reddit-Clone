import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/communities/CommunityInfo.module.css";
import locationInfoStyles from "../../styles/shared/LocationInfo.module.css";
import LoadingLocationInfo from "../shared/LoadingLocationInfo";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Community } from "../../ts_common/interfaces";
import { INITIAL_COMMUNITY } from "../../ts_common/initialStates";

interface Props {
  subId: string;
}

const CommunityInfo = ({ subId }: Props) => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [subInfo, setSubInfo] = useState<Community>(INITIAL_COMMUNITY);

  useEffect(() => {
    if (!subId.length) {
      setSubInfo(INITIAL_COMMUNITY);
    } else {
      getDoc(doc(db, "subre_edits", subId)).then((docSnap) =>
        setSubInfo(docSnap.data() as Community)
      );
    }
  }, [subId]);

  return (
    <>
      {!subInfo.id.length ? (
        <LoadingLocationInfo />
      ) : (
        <div
          className={locationInfoStyles.root}
          style={{ padding: "unset", cursor: postId ? "pointer" : "initial" }}
          onClick={() => postId && navigate(`/r/${subInfo.name}`)}
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
