import stylesBtn from "../../styles/elements/buttons.module.css";
import styles from "../../styles/comments/CommentInput.module.css";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useParams } from "react-router-dom";
import { Comment, Post } from "../../ts_common/interfaces";
import { ImSpinner2 } from "react-icons/im";

interface Props {
  parentCommentId?: string;
  post: Post;
  setShowReplyInput?: React.Dispatch<React.SetStateAction<boolean>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setPost: React.Dispatch<React.SetStateAction<Post>>;
}

const CommentInput = ({
  parentCommentId,
  post,
  setShowReplyInput,
  setComments,
  setPost,
}: Props) => {
  const userProfile = useAppSelector(selectUserProfile);
  const { postId } = useParams();

  const [comment, setComment] = useState<string>("");
  const [isCommentValid, setIsCommentValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const updateFirestoreDocs = async (commentId: string) => {
    const promises = [];

    promises.push(
      updateDoc(doc(db, "users", userProfile.uid), {
        upvotedComments: arrayUnion(commentId),
      }),

      updateDoc(doc(db, "posts", postId!), {
        commentNumber: increment(1),
      })
    );

    if (parentCommentId) {
      promises.push(
        updateDoc(doc(db, "comments", parentCommentId), {
          replyNumber: increment(1),
        })
      );
    }

    await Promise.all(promises);
  };

  const addCommentToUI = (commentId: string) => {
    setComments((prev) => [
      {
        authorId: userProfile.uid,
        authorImg: userProfile.userImg,
        authorUsername: userProfile.username,
        postAuthorId: post.authorId,
        body: comment,
        upvotes: 1,
        downvotes: 0,
        commentId: commentId,
        timestamp: { toMillis: () => Date.now() },
      } as Comment,
      ...prev,
    ]);

    setPost((prev) => ({ ...prev, commentNumber: prev.commentNumber + 1 }));
  };

  const createComment = async () => {
    setIsSubmitting(true);

    const commentRef = await addDoc(collection(db, "comments"), {
      authorId: userProfile.uid,
      postId: postId,
      subId: post.subId,
      parentCommentId: parentCommentId ? parentCommentId : "",
      parentType: parentCommentId ? "comment" : "post",
      body: comment,
      upvotes: 1,
      downvotes: 0,
      replyNumber: 0,
      timestamp: serverTimestamp(),
    });

    await updateFirestoreDocs(commentRef.id);

    addCommentToUI(commentRef.id);

    setShowReplyInput && setShowReplyInput(false);
    setComment("");
    setIsSubmitting(false);
  };

  useEffect(() => {
    comment.length ? setIsCommentValid(true) : setIsCommentValid(false);
  }, [comment]);

  return (
    <div
      className={styles.root}
      style={parentCommentId ? { margin: "12px" } : undefined}
    >
      <textarea
        rows={1}
        placeholder="What are your thoughts?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <div>
        <button
          className={stylesBtn.btnVariantOne}
          disabled={(!isCommentValid || isSubmitting) && true}
          onClick={() => createComment()}
        >
          {isSubmitting ? (
            <ImSpinner2 className={styles.submitSpinner} />
          ) : (
            "Comment"
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
