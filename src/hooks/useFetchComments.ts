import { useCallback, useEffect, useState } from "react";
import { Comment, CommentRaw } from "../ts_common/interfaces";
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

const completeCommentInfo = async (
  docsArray: QueryDocumentSnapshot<DocumentData>[] | DocumentSnapshot<unknown>[]
) => {
  const posts = await Promise.all(
    docsArray.map(async (document) => {
      const data = document.data() as CommentRaw;
      const authorId = data.authorId;
      const subId = data.subId;
      const PostId = data.postId;

      const postDocRef = doc(db, "posts", PostId);
      const postDocSnap = await getDoc(postDocRef);
      const postTitle = postDocSnap.data()?.title;
      const postAuthorId = postDocSnap.data()?.authorId;

      const userDocRef = doc(db, "users", authorId);
      const userDocSnap = await getDoc(userDocRef);
      const authorUsername = userDocSnap.data()?.username;
      const authorImg = userDocSnap.data()?.userImg;

      const subDocRef = doc(db, "subre_edits", subId);
      const subDocSnap = await getDoc(subDocRef);
      const subName = subDocSnap.data()?.name;
      const subImg = subDocSnap.data()?.img;

      return {
        ...data,
        authorUsername,
        authorImg,
        subName,
        subImg,
        postTitle,
        postAuthorId,
        commentId: document.id,
      } as Comment;
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
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
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

const useFetchFirstBatch = (callback: () => void, comments: Array<Comment>) => {
  useEffect(() => {
    if (comments.length === 0) callback();
  }, [callback, comments]);
};

export const useFetchComments = (
  whereField: "authorId" | "postId" | "parentCommentId",
  whereId: string,
  order: "timestamp" | "upvotes",
  shouldFetch: boolean
) => {
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCollectionEmpty, setIsCollectionEmpty] = useState<boolean>(false);
  const [q, setQ] = useState<Query<DocumentData>>();
  const pageSize: number = 9;

  useEffect(() => {
    let q = query(
      collection(db, "comments"),
      where(whereField, "==", whereId),
      orderBy(order, "desc"),
      limit(pageSize)
    );

    if (whereField === "postId" || whereField === "authorId") {
      q = query(q, where("parentType", "==", "post"));
    }

    setQ(q);
    setComments([]);
  }, [whereField, whereId, order]);

  const fetchComments = async () => {
    if (!shouldFetch || isCollectionEmpty || !q) return;

    setIsLoading(true);

    const documentSnapshots = await getDocs(q);

    const newComments = await completeCommentInfo(documentSnapshots.docs);

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];

    setComments(comments.concat(newComments));
    setHasMore(newComments.length === pageSize);
    setIsLoading(false);

    if (!newComments.length && !comments.length) {
      setIsCollectionEmpty(true);
    }

    if (newComments.length) {
      setQ(
        query(
          collection(db, "comments"),
          where(whereField, "==", whereId),
          orderBy(order, "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        )
      );
    }
  };

  useInfiniteScroll(fetchComments, hasMore, isLoading);
  useFetchFirstBatch(fetchComments, comments);

  return {
    comments,
    isLoading,
    hasMore,
    isCollectionEmpty,
    setComments,
  };
};
