import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectUserProfile } from "../redux/features/auth";
import { Post } from "../ts_common/interfaces";

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

    if (isPostUpvoted) {
      updateDoc(userRef, { upvotedPosts: arrayRemove(post.postId) });
      updateDoc(postRef, { upvotes: increment(-1) });
      setUpvoteCount((prevCount) => prevCount - 1);
    } else {
      updateDoc(userRef, { upvotedPosts: arrayUnion(post.postId) });
      updateDoc(postRef, { upvotes: increment(1) });
      setUpvoteCount((prevCount) => prevCount + 1);

      if (isPostDownvoted) {
        updateDoc(userRef, { downvotedPosts: arrayRemove(post.postId) });
        updateDoc(postRef, { downvotes: increment(-1) });
        setDownvoteCount((prevCount) => prevCount - 1);
      }
    }
  };

  const downvotePost = () => {
    const userRef = doc(db, "users", userProfile.uid);
    const postRef = doc(db, "posts", post.postId);

    if (isPostDownvoted) {
      updateDoc(userRef, { downvotedPosts: arrayRemove(post.postId) });
      updateDoc(postRef, { downvotes: increment(-1) });
      setDownvoteCount((prevCount) => prevCount - 1);
    } else {
      updateDoc(userRef, { downvotedPosts: arrayUnion(post.postId) });
      updateDoc(postRef, { downvotes: increment(1) });
      setDownvoteCount((prevCount) => prevCount + 1);

      if (isPostUpvoted) {
        updateDoc(userRef, { upvotedPosts: arrayRemove(post.postId) });
        updateDoc(postRef, { upvotes: increment(-1) });
        setUpvoteCount((prevCount) => prevCount - 1);
      }
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
