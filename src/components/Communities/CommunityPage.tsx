import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Community } from "../../ts_common/interfaces";
import CommunityHeader from "./CommunityHeader";

const CommunityPage = () => {
  const { subName } = useParams();

  const [subExist, setSubExist] = useState<boolean>(true);
  const [subInfo, setSubInfo] = useState<Community>();

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
    getSubInfo();
  }, [subName]);

  return (
    <div>
      <CommunityHeader subInfo={subInfo} />
    </div>
  );
};

export default CommunityPage;
