import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Community } from "../../ts_common/interfaces";
import CommunityHeader from "./CommunityHeader";
import CommunityPosts from "./CommunityPosts";
import { INITIAL_COMMUNITY } from "../../ts_common/initialStates";
import styles from "../../styles/shared/LocationMainContent.module.css";
import CommunityInfo from "./CommunityInfo";
import CommunityNotFound from "./CommunityNotFound";

const CommunityPage = () => {
  const { subName } = useParams();

  const [subExist, setSubExist] = useState<boolean>(true);
  const [subInfo, setSubInfo] = useState<Community>(INITIAL_COMMUNITY);

  useEffect(() => {
    const getSubInfo = async () => {
      const q = query(
        collection(db, "subre_edits"),
        where("name", "==", subName),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSubExist(true);
        setSubInfo(querySnapshot.docs[0].data() as Community);
      } else {
        setSubExist(false);
      }
    };
    setSubInfo(INITIAL_COMMUNITY);
    getSubInfo();
  }, [subName]);

  return (
    <>
      {subExist ? (
        <div>
          <CommunityHeader subInfo={subInfo} />

          <div className={styles.contentWrapper}>
            <CommunityPosts subInfo={subInfo} />

            <CommunityInfo subId={subInfo.id} />
          </div>
        </div>
      ) : (
        <CommunityNotFound />
      )}
    </>
  );
};

export default CommunityPage;
