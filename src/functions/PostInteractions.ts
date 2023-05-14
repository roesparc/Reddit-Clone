import {
  WriteBatch,
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectUserProfile } from "../redux/features/auth";
import { Post, UserProfile } from "../ts_common/interfaces";

const sendNotification = (
  post: Post,
  userProfile: UserProfile,
  batch: WriteBatch
) => {
  if (userProfile.uid === post.authorId) return;

  batch.set(doc(db, "notifications", userProfile.uid + post.postId), {
    isRead: false,
    authorId: userProfile.uid,
    forUserId: post.authorId,
    subId: post.subId,
    postId: post.postId,
    targetId: post.postId,
    notification: "upvoted your post",
    body: "",
    type: "upvote",
    originUrl: `/r/${post.subName}/${post.postId}`,
    timestamp: serverTimestamp(),
  });

  batch.update(doc(db, "users", post.authorId), {
    notifications: arrayUnion(userProfile.uid + post.postId),
  });
};

const removeNotification = (
  post: Post,
  userProfile: UserProfile,
  batch: WriteBatch
) => {
  if (userProfile.uid === post.authorId) return;

  batch.delete(doc(db, "notifications", userProfile.uid + post.postId));

  batch.update(doc(db, "users", post.authorId), {
    notifications: arrayRemove(userProfile.uid + post.postId),
  });
};

const usePostInteractions = (post: Post) => {
  const userProfile = useAppSelector(selectUserProfile);
  const isPostUpvoted = userProfile.upvotedPosts.includes(post.postId);
  const isPostDownvoted = userProfile.downvotedPosts.includes(post.postId);
  const isPostSaved = userProfile.savedPosts.includes(post.postId);
  const [upvoteCount, setUpvoteCount] = useState<number>(post.upvotes);
  const [downvoteCount, setDownvoteCount] = useState<number>(post.downvotes);

  const upvotePost = () => {
    const userRef = doc(db, "users", userProfile.uid);
    const postRef = doc(db, "posts", post.postId);
    const batch = writeBatch(db);

    if (isPostUpvoted) {
      batch.update(userRef, { upvotedPosts: arrayRemove(post.postId) });
      batch.update(postRef, { upvotes: increment(-1) });
      removeNotification(post, userProfile, batch);
      setUpvoteCount((prevCount) => prevCount - 1);

      batch.commit();
    } else {
      batch.update(userRef, { upvotedPosts: arrayUnion(post.postId) });
      batch.update(postRef, { upvotes: increment(1) });
      sendNotification(post, userProfile, batch);
      setUpvoteCount((prevCount) => prevCount + 1);

      if (isPostDownvoted) {
        batch.update(userRef, { downvotedPosts: arrayRemove(post.postId) });
        batch.update(postRef, { downvotes: increment(-1) });
        setDownvoteCount((prevCount) => prevCount - 1);
      }

      batch.commit();
    }
  };

  const downvotePost = () => {
    const userRef = doc(db, "users", userProfile.uid);
    const postRef = doc(db, "posts", post.postId);
    const batch = writeBatch(db);

    if (isPostDownvoted) {
      batch.update(userRef, { downvotedPosts: arrayRemove(post.postId) });
      batch.update(postRef, { downvotes: increment(-1) });
      setDownvoteCount((prevCount) => prevCount - 1);

      batch.commit();
    } else {
      batch.update(userRef, { downvotedPosts: arrayUnion(post.postId) });
      batch.update(postRef, { downvotes: increment(1) });
      setDownvoteCount((prevCount) => prevCount + 1);

      if (isPostUpvoted) {
        batch.update(userRef, { upvotedPosts: arrayRemove(post.postId) });
        batch.update(postRef, { upvotes: increment(-1) });
        removeNotification(post, userProfile, batch);
        setUpvoteCount((prevCount) => prevCount - 1);
      }

      batch.commit();
    }
  };

  const savePost = () => {
    const userRef = doc(db, "users", userProfile.uid);

    if (isPostSaved) {
      updateDoc(userRef, { savedPosts: arrayRemove(post.postId) });
    } else {
      updateDoc(userRef, { savedPosts: arrayUnion(post.postId) });
    }
  };

  return {
    isPostUpvoted,
    isPostDownvoted,
    isPostSaved,
    upvoteCount,
    downvoteCount,
    upvotePost,
    downvotePost,
    savePost,
  };
};

export default usePostInteractions;
