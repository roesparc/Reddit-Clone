import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Comment, Post } from "../ts_common/interfaces";

const deleteComment = async (
  comment: Comment,
  setIsDeleted?: React.Dispatch<React.SetStateAction<boolean>>,
  setPost?: React.Dispatch<React.SetStateAction<Post>>
) => {
  const repliesQ = query(
    collection(db, "comments"),
    where("parentCommentId", "==", comment.commentId)
  );

  const usersUpvotedQ = query(
    collection(db, "users"),
    where("upvotedComments", "array-contains", comment.commentId)
  );

  const usersDownvotedQ = query(
    collection(db, "users"),
    where("downvotedComments", "array-contains", comment.commentId)
  );

  const notificationsQ = query(
    collection(db, "notifications"),
    where("targetId", "==", comment.commentId)
  );

  const [
    repliesSnap,
    usersUpvotedSnap,
    usersDownvotedSnap,
    notificationsSnap,
    postSnap,
  ] = await Promise.all([
    getDocs(repliesQ),
    getDocs(usersUpvotedQ),
    getDocs(usersDownvotedQ),
    getDocs(notificationsQ),
    getDoc(doc(db, "posts", comment.postId)),
  ]);

  const batch = writeBatch(db);

  batch.delete(doc(db, "comments", comment.commentId));

  if (!repliesSnap.empty) {
    repliesSnap.forEach((doc) =>
      deleteComment(
        { ...doc.data(), commentId: doc.id } as Comment,
        undefined,
        setPost
      )
    );
  }

  usersUpvotedSnap.forEach((doc) =>
    batch.update(doc.ref, {
      upvotedComments: arrayRemove(comment.commentId),
    })
  );

  usersDownvotedSnap.forEach((doc) =>
    batch.update(doc.ref, {
      downvotedComments: arrayRemove(comment.commentId),
    })
  );

  notificationsSnap.forEach((document) => {
    batch.delete(document.ref);
    batch.update(doc(db, "users", document.data().forUserId), {
      notifications: arrayRemove(document.id),
    });
  });

  if (postSnap.exists()) {
    batch.update(postSnap.ref, {
      commentNumber: increment(-1),
    });
  }

  await batch.commit();

  setPost?.((prev) => {
    if (prev.commentNumber === 0) return prev;

    return {
      ...prev,
      commentNumber: prev.commentNumber - 1,
    };
  });
  setIsDeleted?.(true);
};

export default deleteComment;
