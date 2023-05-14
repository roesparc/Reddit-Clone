import {
  arrayRemove,
  collection,
  doc,
  getDocs,
  increment,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { Post } from "../ts_common/interfaces";
import { deleteObject, ref } from "firebase/storage";

const deletePost = async (
  post: Post,
  setIsDeleted?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const usersUpvotedQ = query(
    collection(db, "users"),
    where("upvotedPosts", "array-contains", post.postId)
  );

  const usersDownvotedQ = query(
    collection(db, "users"),
    where("downvotedPosts", "array-contains", post.postId)
  );

  const usersSavedQ = query(
    collection(db, "users"),
    where("savedPosts", "array-contains", post.postId)
  );

  const notificationsQ = query(
    collection(db, "notifications"),
    where("postId", "==", post.postId)
  );

  const [
    usersUpvotedSnap,
    usersDownvotedSnap,
    usersSavedSnap,
    notificationsSnap,
  ] = await Promise.all([
    getDocs(usersUpvotedQ),
    getDocs(usersDownvotedQ),
    getDocs(usersSavedQ),
    getDocs(notificationsQ),
  ]);

  const batch = writeBatch(db);

  batch.delete(doc(db, "posts", post.postId));

  if (post.img) await deleteObject(ref(storage, `posts/${post.postId}`));

  usersUpvotedSnap.forEach((doc) =>
    batch.update(doc.ref, {
      upvotedPosts: arrayRemove(post.postId),
    })
  );

  usersDownvotedSnap.forEach((doc) =>
    batch.update(doc.ref, {
      downvotedPosts: arrayRemove(post.postId),
    })
  );

  usersSavedSnap.forEach((doc) =>
    batch.update(doc.ref, {
      savedPosts: arrayRemove(post.postId),
    })
  );

  notificationsSnap.forEach((document) => {
    batch.delete(document.ref);
    batch.update(doc(db, "users", document.data().forUserId), {
      notifications: arrayRemove(document.id),
    });
  });

  batch.update(doc(db, "subre_edits", post.subId), {
    postNumber: increment(-1),
  });

  await batch.commit();

  setIsDeleted?.(true);
};

export default deletePost;
