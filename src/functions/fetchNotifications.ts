import { useState, useEffect } from "react";
import { INITIAL_NOTIFICATION_DATA } from "../ts_common/initialStates";
import { Notification, NotificationRaw } from "../ts_common/interfaces";
import { useAppSelector } from "../redux/hooks";
import { selectUserProfile } from "../redux/features/auth";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

const completeNotificationInfo = async (
  docsArray: QueryDocumentSnapshot<DocumentData>[]
) => {
  return await Promise.all(
    docsArray.map(async (document) => {
      const data = document.data() as NotificationRaw;

      if (!data.authorId) return { ...data } as Notification;

      const authorId = data.authorId;
      const subId = data.subId;

      const userDocRef = doc(db, "users", authorId);
      const userDocSnap = await getDoc(userDocRef);
      const authorUsername = userDocSnap.data()?.username;
      const authorImg = userDocSnap.data()?.userImg;

      const subDocRef = doc(db, "subre_edits", subId);
      const subDocSnap = await getDoc(subDocRef);
      const subName = subDocSnap.data()?.name;

      return {
        ...data,
        authorUsername,
        authorImg,
        subName,
        notificationId: document.id,
      } as Notification;
    })
  );
};

const useFetchNotifications = (showNotifications: boolean) => {
  const userProfile = useAppSelector(selectUserProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Array<Notification>>([
    INITIAL_NOTIFICATION_DATA,
  ]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const q = query(
        collection(db, "notifications"),
        where("forUserId", "in", [userProfile.uid, "all users"]),
        orderBy("timestamp", "desc"),
        limit(15)
      );

      const querySnapshot = await getDocs(q);

      setNotifications(await completeNotificationInfo(querySnapshot.docs));
      querySnapshot.empty ? setIsEmpty(true) : setIsEmpty(false);
      setIsLoading(false);
    };

    showNotifications ? fetchNotifications() : setIsLoading(true);
  }, [showNotifications, userProfile.uid]);

  return { isLoading, isEmpty, notifications };
};

export default useFetchNotifications;
