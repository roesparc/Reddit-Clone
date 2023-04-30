import { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectUserProfile } from "../redux/features/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Post } from "../ts_common/interfaces";
import { completePostsInfo } from "./getPosts";

export const useFetchInteractionPosts = (
  interactionType: "upvotedPosts" | "downvotedPosts" | "savedPosts"
) => {
  const userProfile = useAppSelector(selectUserProfile);
  const interactionPostIds = userProfile[interactionType].slice().reverse();
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sliceStart, setSliceStart] = useState<number>(0);
  const isCollectionEmpty = interactionPostIds.length < 1;
  const pageSize = 9;

  const fetchInteractionPosts = async () => {
    if (isCollectionEmpty) return;

    setIsLoading(true);

    const query = interactionPostIds.slice(sliceStart, sliceStart + pageSize);

    const postDocs = await Promise.all(
      query.map((postId) => getDoc(doc(db, "posts", postId)))
    );

    const newposts = await completePostsInfo(postDocs);

    setPosts(posts.concat(newposts));
    setSliceStart(sliceStart + pageSize);
    setHasMore(query.length === pageSize);
    setIsLoading(false);
  };

  return {
    posts,
    hasMore,
    isLoading,
    isCollectionEmpty,
    fetchInteractionPosts,
  };
};
