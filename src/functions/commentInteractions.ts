import { useState } from "react";
import { selectUserProfile } from "../redux/features/auth";
import { useAppSelector } from "../redux/hooks";
import { Comment } from "../ts_common/interfaces";
import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const useCommentInteractions = (comment: Comment) => {
  const userProfile = useAppSelector(selectUserProfile);
  const isCommentUpvoted = userProfile.upvotedComments.includes(
    comment.commentId
  );
  const isCommentDownvoted = userProfile.downvotedComments.includes(
    comment.commentId
  );
  const [upvoteCount, setUpvoteCount] = useState<number>(comment.upvotes);
  const [downvoteCount, setDownvoteCount] = useState<number>(comment.downvotes);

  const upvoteComment = () => {
    const userRef = doc(db, "users", userProfile.uid);
    const commentRef = doc(db, "comments", comment.commentId);

    if (isCommentUpvoted) {
      updateDoc(userRef, { upvotedComments: arrayRemove(comment.commentId) });
      updateDoc(commentRef, { upvotes: increment(-1) });
      setUpvoteCount((prevCount) => prevCount - 1);
    } else {
      updateDoc(userRef, { upvotedComments: arrayUnion(comment.commentId) });
      updateDoc(commentRef, { upvotes: increment(1) });
      setUpvoteCount((prevCount) => prevCount + 1);

      if (isCommentDownvoted) {
        updateDoc(userRef, {
          downvotedComments: arrayRemove(comment.commentId),
        });
        updateDoc(commentRef, { downvotes: increment(-1) });
        setDownvoteCount((prevCount) => prevCount - 1);
      }
    }
  };

  const downvoteComment = () => {
    const userRef = doc(db, "users", userProfile.uid);
    const commentRef = doc(db, "comments", comment.commentId);

    if (isCommentDownvoted) {
      updateDoc(userRef, { downvotedComments: arrayRemove(comment.commentId) });
      updateDoc(commentRef, { downvotes: increment(-1) });
      setDownvoteCount((prevCount) => prevCount - 1);
    } else {
      updateDoc(userRef, { downvotedComments: arrayUnion(comment.commentId) });
      updateDoc(commentRef, { downvotes: increment(1) });
      setDownvoteCount((prevCount) => prevCount + 1);

      if (isCommentUpvoted) {
        updateDoc(userRef, { upvotedComments: arrayRemove(comment.commentId) });
        updateDoc(commentRef, { upvotes: increment(-1) });
        setUpvoteCount((prevCount) => prevCount - 1);
      }
    }
  };

  return {
    isCommentUpvoted,
    isCommentDownvoted,
    upvoteCount,
    downvoteCount,
    upvoteComment,
    downvoteComment,
  };
};

export default useCommentInteractions;
