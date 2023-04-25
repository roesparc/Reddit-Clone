import {
  DocumentData,
  DocumentSnapshot,
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
import { Post, PostRaw } from "../ts_common/interfaces";

const completePostsInfo = async (
  docsArray: QueryDocumentSnapshot<DocumentData>[] | DocumentSnapshot<unknown>[]
) => {
  const posts = await Promise.all(
    docsArray.map(async (document) => {
      const data = document.data() as PostRaw;
      const authorId = data.authorId;
      const subId = data.subId;

      const userDocRef = doc(db, "users", authorId);
      const userDocSnap = await getDoc(userDocRef);
      const authorUsername = userDocSnap.data()?.username;

      const subDocRef = doc(db, "subre_edits", subId);
      const subDocSnap = await getDoc(subDocRef);
      const subName = subDocSnap.data()?.name;
      const subImg = subDocSnap.data()?.img;

      return {
        ...data,
        authorUsername,
        subName,
        subImg,
        postId: document.id,
      } as Post;
    })
  );

  return posts;
};

export const getPosts = async (
  whereField: "authorId" | "subId",
  whereId: string,
  order: "timestamp" | "upvotes"
) => {
  const q = query(
    collection(db, "posts"),
    where(whereField, "==", whereId),
    orderBy(order, "desc"),
    limit(9)
  );
  const postsQuerySnapshot = await getDocs(q);

  return await completePostsInfo(postsQuerySnapshot.docs);
};

export const getUserPosts = async (
  userId: string,
  postCollection: "saved" | "upvoted" | "downvoted"
) => {
  const userRef = doc(db, "users", userId);
  const q = query(collection(userRef, postCollection), limit(9));
  const querySnapshot = await getDocs(q);

  const postRefs = querySnapshot.docs.map((doc) => doc.data().postRef);
  const postDocs = await Promise.all(postRefs.map(getDoc));

  return await completePostsInfo(postDocs);
};
