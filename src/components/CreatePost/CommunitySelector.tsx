import { useEffect, useRef, useState } from "react";
import styles from "../../styles/createPost/CommunitySelector.module.css";
import { RxCaretDown } from "react-icons/rx";
import { Community } from "../../ts_common/interfaces";
import { INITIAL_COMMUNITY } from "../../ts_common/initialStates";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase/config";

interface Props {
  subInfo: Community;
  setSubInfo: React.Dispatch<React.SetStateAction<Community>>;
}

const CommunitySelector = ({ subInfo, setSubInfo }: Props) => {
  const communityBtnRef = useRef<HTMLButtonElement>(null);
  const [showCommunityMenu, setShowCommunityMenu] = useState<boolean>(false);
  const [availableCommunities, setAvailableCommunities] = useState<
    Array<Community>
  >([INITIAL_COMMUNITY]);

  const changeCommunity = async (subId: string) => {
    const docRef = doc(db, "subre_edits", subId);
    const docSnap = await getDoc(docRef);

    setSubInfo(docSnap.data() as Community);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!communityBtnRef.current?.contains(event.target as Node)) {
        setShowCommunityMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const getCommunities = async () => {
      const q = query(collection(db, "subre_edits"));
      const querySnapshot = await getDocs(q);

      const communities = querySnapshot.docs.map(
        (doc) => doc.data() as Community
      );

      const filteredCommunities = communities.filter(
        (community) => community.name !== subInfo.name
      );

      setAvailableCommunities(filteredCommunities);
    };
    getCommunities();
  }, [subInfo]);

  return (
    <div className={styles.root}>
      <button
        className={`${styles.communityBtn}  ${
          showCommunityMenu && styles.menuOpen
        }`}
        ref={communityBtnRef}
        onClick={() => setShowCommunityMenu((prev) => !prev)}
      >
        {subInfo.name.length > 0 ? (
          <img src={subInfo.img} alt="Main" />
        ) : (
          <span className={styles.imgSkeleton}></span>
        )}
        <span>
          {subInfo.name.length > 0 ? `r/${subInfo.name}` : "Choose a community"}
        </span>
        <RxCaretDown viewBox="1 1 13 13" />
      </button>

      {showCommunityMenu && (
        <div className={styles.communityMenu}>
          <p>Communities</p>

          {availableCommunities.map((community) => (
            <button
              key={community.id}
              className={styles.communitySelectBtn}
              onClick={() => changeCommunity(community.id)}
            >
              <img src={community.img} alt="Main" />
              <span>r/{community.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunitySelector;
