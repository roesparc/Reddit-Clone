import { BsBell } from "react-icons/bs";
import stylesHeader from "../../styles/header/Header.module.css";
import { useEffect, useState, useRef } from "react";
import useFetchNotifications from "../../functions/fetchNotifications";
import { Link } from "react-router-dom";
import { TbArrowBigUp } from "react-icons/tb";
import { FaCommentAlt } from "react-icons/fa";
import getElapsedtime from "../../functions/getElapsedTime";
import styles from "../../styles/header/Notifications.module.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Notification } from "../../ts_common/interfaces";
import { ImSpinner2 } from "react-icons/im";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";

const Notifications = () => {
  const userProfile = useAppSelector(selectUserProfile);
  const notificationBtnRef = useRef<HTMLButtonElement | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const { isLoading, isEmpty, notifications } =
    useFetchNotifications(showNotifications);

  const readNotification = (notification: Notification) => {
    if (!notification.isRead)
      updateDoc(doc(db, "notifications", notification.notificationId), {
        isRead: true,
      });
  };

  useEffect(() => {
    if (userProfile.notifications.length > 9) {
      document.title = "(+9) Re_edit";
    } else if (userProfile.notifications.length) {
      document.title = `(${userProfile.notifications.length}) Re_edit`;
    } else {
      document.title = "Re_edit";
    }
  }, [userProfile.notifications.length]);

  useEffect(() => {
    if (!isLoading)
      updateDoc(doc(db, "users", userProfile.uid), { notifications: [] });
  }, [isLoading, userProfile.uid]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!notificationBtnRef.current?.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <button
        ref={notificationBtnRef}
        className={stylesHeader.userInteractionBtns}
        onClick={() => setShowNotifications((prev) => !prev)}
      >
        <BsBell />

        {!!userProfile.notifications.length && (
          <div className={styles.notificationNumber}>
            {userProfile.notifications.length > 9
              ? "9+"
              : userProfile.notifications.length}
          </div>
        )}
      </button>

      {showNotifications && (
        <div className={styles.root}>
          <h3 className={styles.heading}>Notifications</h3>

          <div className={styles.notificationsContainer}>
            {isLoading ? (
              <ImSpinner2 className={styles.spinner} />
            ) : isEmpty ? (
              <div className={styles.noNotifications}>No notifications</div>
            ) : (
              notifications.map((notification) => (
                <Link
                  to={notification.originUrl}
                  key={notification.notificationId}
                  className={styles.notification}
                  style={
                    !notification.isRead
                      ? { backgroundColor: "#24a0ed1a" }
                      : undefined
                  }
                  onClick={() => readNotification(notification)}
                >
                  <div className={styles.imgSide}>
                    <img src={notification.authorImg} alt="author" />

                    {notification.authorId && (
                      <span>
                        {notification.type === "upvote" ? (
                          <TbArrowBigUp
                            viewBox="1.5 1.8 20 20"
                            className={styles.upvoteType}
                          />
                        ) : (
                          <FaCommentAlt className={styles.commentType} />
                        )}
                      </span>
                    )}
                  </div>

                  <div>
                    {notification.authorId ? (
                      <div className={styles.notificationInfo}>
                        u/{notification.authorUsername}{" "}
                        {notification.notification} in r/{notification.subName}{" "}
                        <span>
                          •{" "}
                          {getElapsedtime(
                            notification.timestamp?.toMillis() ?? 0
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.notificationInfo}>
                        {notification.notification}
                      </div>
                    )}

                    {notification.body && (
                      <span className={styles.notificationBody}>
                        {notification.body}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;
