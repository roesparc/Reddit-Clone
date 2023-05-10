import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Comment, Post } from "../ts_common/interfaces";

const deleteComment = async (
  comment: Comment,
  setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>,
  setPost?: React.Dispatch<React.SetStateAction<Post>>
) => {
  let deletedCommentsQuantity = 1;
  const q = query(
    collection(db, "comments"),
    where("parentCommentId", "==", comment.commentId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    deletedCommentsQuantity += querySnapshot.docs.length;
    await Promise.all(querySnapshot.docs.map((doc) => deleteDoc(doc.ref)));
  }

  Promise.all([
    deleteDoc(doc(db, "comments", comment.commentId)),
    updateDoc(doc(db, "posts", comment.postId), {
      commentNumber: increment(-deletedCommentsQuantity),
    }),
  ]);

  setPost &&
    setPost((prev) => ({
      ...prev,
      commentNumber: prev.commentNumber - deletedCommentsQuantity,
    }));
  setIsDeleted(true);
};

export default deleteComment;
