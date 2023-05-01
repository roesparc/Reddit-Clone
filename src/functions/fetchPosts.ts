import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectUserProfile } from "../redux/features/auth";
import {
  DocumentData,
  DocumentSnapshot,
  Query,
  QueryDocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
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

const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean,
  isLoading: boolean
) => {
  const onScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      hasMore &&
      !isLoading
    ) {
      callback();
    }
  }, [hasMore, isLoading, callback]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
};

const useFetchFirstBatch = (callback: () => void, posts: Array<Post>) => {
  useEffect(() => {
    if (posts.length === 0) callback();
  }, [callback, posts]);
};

export const useFetchInteractionPosts = (
  interactionType: "upvotedPosts" | "downvotedPosts" | "savedPosts"
) => {
  const userProfile = useAppSelector(selectUserProfile);
  const [interactionPostIds] = useState<Array<string>>(
    userProfile[interactionType].slice().reverse()
  );
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sliceStart, setSliceStart] = useState<number>(0);
  const isCollectionEmpty: boolean = interactionPostIds.length === 0;
  const pageSize: number = 9;

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

  useInfiniteScroll(fetchInteractionPosts, hasMore, isLoading);
  useFetchFirstBatch(fetchInteractionPosts, posts);

  return {
    posts,
    isLoading,
    hasMore,
    isCollectionEmpty,
  };
};

export const useFetchPosts = (
  whereField: "authorId" | "subId",
  whereId: string,
  order: "timestamp" | "upvotes",
  shouldFetch: boolean
) => {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCollectionEmpty, setIsCollectionEmpty] = useState<boolean>(false);
  const [q, setQ] = useState<Query<DocumentData>>();
  const pageSize: number = 9;

  useEffect(() => {
    setQ(
      query(
        collection(db, "posts"),
        where(whereField, "==", whereId),
        orderBy(order, "desc"),
        limit(pageSize)
      )
    );

    setPosts([]);
  }, [whereField, whereId, order]);

  const fetchPosts = async () => {
    if (!shouldFetch || isCollectionEmpty) return;

    setIsLoading(true);

    const documentSnapshots = await getDocs(q!);

    const newPosts = await completePostsInfo(documentSnapshots.docs);

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];

    setPosts(posts.concat(newPosts));
    setHasMore(newPosts.length === pageSize);
    setIsLoading(false);

    if (!newPosts.length && !posts.length) {
      setIsCollectionEmpty(true);
    }

    if (newPosts.length) {
      setQ(
        query(
          collection(db, "posts"),
          where(whereField, "==", whereId),
          orderBy(order, "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        )
      );
    }
  };

  useInfiniteScroll(fetchPosts, hasMore, isLoading);
  useFetchFirstBatch(fetchPosts, posts);

  return {
    posts,
    isLoading,
    hasMore,
    isCollectionEmpty,
  };
};
