import { useState } from "react";
import { selectUserProfile } from "../redux/features/auth";
import { useAppSelector } from "../redux/hooks";
import { Comment, UserProfile } from "../ts_common/interfaces";
import {
  WriteBatch,
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";

const sendNotification = (
  comment: Comment,
  userProfile: UserProfile,
  batch: WriteBatch
) => {
  if (userProfile.uid === comment.authorId) return;

  batch.set(doc(db, "notifications", userProfile.uid + comment.commentId), {
    isRead: false,
    authorId: userProfile.uid,
    forUserId: comment.authorId,
    subId: comment.subId,
    postId: comment.postId,
    targetId: comment.commentId,
    notification: "upvoted your comment",
    body: comment.body,
    type: "upvote",
    originUrl: `/r/${comment.subName}/${comment.postId}`,
    timestamp: serverTimestamp(),
  });

  batch.update(doc(db, "users", comment.authorId), {
    notifications: arrayUnion(userProfile.uid + comment.commentId),
  });
};

const removeNotification = (
  comment: Comment,
  userProfile: UserProfile,
  batch: WriteBatch
) => {
  if (userProfile.uid === comment.authorId) return;

  batch.delete(doc(db, "notifications", userProfile.uid + comment.commentId));

  batch.update(doc(db, "users", comment.authorId), {
    notifications: arrayRemove(userProfile.uid + comment.commentId),
  });
};

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
    const batch = writeBatch(db);

    if (isCommentUpvoted) {
      batch.update(userRef, {
        upvotedComments: arrayRemove(comment.commentId),
      });
      batch.update(commentRef, { upvotes: increment(-1) });
      removeNotification(comment, userProfile, batch);
      setUpvoteCount((prevCount) => prevCount - 1);

      batch.commit();
    } else {
      batch.update(userRef, { upvotedComments: arrayUnion(comment.commentId) });
      batch.update(commentRef, { upvotes: increment(1) });
      sendNotification(comment, userProfile, batch);
      setUpvoteCount((prevCount) => prevCount + 1);

      if (isCommentDownvoted) {
        batch.update(userRef, {
          downvotedComments: arrayRemove(comment.commentId),
        });
        batch.update(commentRef, { downvotes: increment(-1) });
        setDownvoteCount((prevCount) => prevCount - 1);
      }

      batch.commit();
    }
  };

  const downvoteComment = () => {
    const userRef = doc(db, "users", userProfile.uid);
    const commentRef = doc(db, "comments", comment.commentId);
    const batch = writeBatch(db);

    if (isCommentDownvoted) {
      batch.update(userRef, {
        downvotedComments: arrayRemove(comment.commentId),
      });
      batch.update(commentRef, { downvotes: increment(-1) });
      setDownvoteCount((prevCount) => prevCount - 1);

      batch.commit();
    } else {
      batch.update(userRef, {
        downvotedComments: arrayUnion(comment.commentId),
      });
      batch.update(commentRef, { downvotes: increment(1) });
      setDownvoteCount((prevCount) => prevCount + 1);

      if (isCommentUpvoted) {
        batch.update(userRef, {
          upvotedComments: arrayRemove(comment.commentId),
        });
        batch.update(commentRef, { upvotes: increment(-1) });
        removeNotification(comment, userProfile, batch);
        setUpvoteCount((prevCount) => prevCount - 1);
      }

      batch.commit();
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
