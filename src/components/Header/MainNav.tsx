import { Link, useLocation } from "react-router-dom";
import { RxCaretDown } from "react-icons/rx";
import { FaHome } from "react-icons/fa";
import styles from "../../styles/header/MainNav.module.css";
import { useEffect, useRef, useState } from "react";
import { Community } from "../../ts_common/interfaces";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import { BsPlusLg } from "react-icons/bs";

interface CurrentLocation {
  name: string;
  img: string;
}

const MainNav = () => {
  const userProfile = useAppSelector(selectUserProfile);
  const location = useLocation();
  const navBtnRef = useRef<HTMLButtonElement>(null);

  const [communities, setCommunities] = useState<Array<Community>>([]);
  const [showNav, setShowNav] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>({
    name: "",
    img: "",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!navBtnRef.current?.contains(event.target as Node)) {
        setShowNav(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    getDocs(collection(db, "subre_edits")).then((snap) =>
      setCommunities(snap.docs.map((doc) => doc.data() as Community))
    );
  }, []);

  useEffect(() => {
    const getCommunityInfo = () => {
      if (
        !communities.length ||
        location.pathname.split("/").pop() === "submit"
      )
        return;

      const pathSegments = location.pathname.split("/");
      const subNameIndex = pathSegments.indexOf("r") + 1;
      const subName = pathSegments[subNameIndex];

      const selectedCommunity = communities.find(
        (community) => community.name === subName
      );

      setCurrentLocation({
        name: selectedCommunity!.name,
        img: selectedCommunity!.img,
      });
    };

    const getUserInfo = () => {
      const pathSegments = location.pathname.split("/");
      const usernameIndex = pathSegments.indexOf("user") + 1;
      const username = pathSegments[usernameIndex];

      if (username === userProfile.username) {
        setCurrentLocation({
          name: userProfile.username,
          img: userProfile.userImg,
        });
      } else {
        const q = query(
          collection(db, "users"),
          where("username", "==", username),
          limit(1)
        );

        getDocs(q).then((snap) =>
          setCurrentLocation({
            name: snap.docs[0].data().username,
            img: snap.docs[0].data().userImg,
          })
        );
      }
    };

    if (location.pathname.includes("/r/")) {
      getCommunityInfo();
    } else if (location.pathname.includes("/user/")) {
      getUserInfo();
    }
  }, [location, userProfile, communities]);

  return (
    <div className={styles.root}>
      <button
        className={styles.navBtn}
        ref={navBtnRef}
        onClick={() => setShowNav((prev) => !prev)}
      >
        {location.pathname === "/" ? (
          <>
            <FaHome className={styles.currentLocationImg} />
            <span className={styles.currentLocation}>Home</span>
          </>
        ) : location.pathname === "/settings/profile" ? (
          <>
            <img
              src={userProfile.userImg}
              alt="user"
              className={styles.currentLocationImg}
            />
            <span className={styles.currentLocation}>User Settings</span>
          </>
        ) : location.pathname.split("/").pop() === "submit" ? (
          <>
            <BsPlusLg className={styles.currentLocationImg} />
            <p className={styles.currentLocation}>Create Post</p>
          </>
        ) : (
          <>
            <img
              src={currentLocation.img}
              alt=""
              className={styles.currentLocationImg}
            />
            <span className={styles.currentLocation}>
              {currentLocation.name}
            </span>
          </>
        )}
        <RxCaretDown viewBox="1 1 13 13" className={styles.caretDown} />
      </button>

      {showNav && (
        <div className={styles.navContainer}>
          <h3>Communities</h3>

          {communities.map((community) => (
            <Link
              key={community.id}
              to={`/r/${community.name}`}
              className={styles.navItem}
            >
              <img src={community.img} alt="community" />
              <p>r/{community.name}</p>
            </Link>
          ))}

          <h3>Feeds</h3>

          <Link to="/" className={styles.navItem}>
            <FaHome />
            <p>Home</p>
          </Link>

          <h3>Other</h3>

          <Link to="/settings/profile" className={styles.navItem}>
            <img src={userProfile.userImg} alt="user" />
            <p>User Settings</p>
          </Link>

          <Link to="/submit" className={styles.navItem}>
            <BsPlusLg />
            <p>Create Post</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MainNav;
