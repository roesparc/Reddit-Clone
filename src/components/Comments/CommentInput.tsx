import stylesBtn from "../../styles/elements/buttons.module.css";
import styles from "../../styles/comments/CommentInput.module.css";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectUserProfile } from "../../redux/features/auth";
import {
  WriteBatch,
  addDoc,
  arrayUnion,
  collection,
  doc,
  increment,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useParams } from "react-router-dom";
import { Comment, Post } from "../../ts_common/interfaces";
import { ImSpinner2 } from "react-icons/im";

interface Props {
  passedComment?: Comment;
  post: Post;
  setShowReplyInput?: React.Dispatch<React.SetStateAction<boolean>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setPost: React.Dispatch<React.SetStateAction<Post>>;
}

const CommentInput = ({
  passedComment,
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

  const sendNotification = (commentId: string, batch: WriteBatch) => {
    const parent = passedComment ? passedComment : post;

    if (userProfile.uid === parent.authorId) return;

    batch.set(doc(db, "notifications", userProfile.uid + commentId), {
      isRead: false,
      authorId: userProfile.uid,
      forUserId: parent.authorId,
      subId: parent.subId,
      postId: parent.postId,
      targetId: commentId,
      notification: passedComment
        ? "replied to your comment"
        : "replied to your post",
      body: comment,
      type: "comment",
      originUrl: `/r/${parent.subName}/${parent.postId}`,
      timestamp: serverTimestamp(),
    });

    batch.update(doc(db, "users", parent.authorId), {
      notifications: arrayUnion(userProfile.uid + commentId),
    });
  };

  const updateFirestoreDocs = async (commentId: string, batch: WriteBatch) => {
    batch.update(doc(db, "users", userProfile.uid), {
      upvotedComments: arrayUnion(commentId),
    });

    batch.update(doc(db, "posts", postId!), {
      commentNumber: increment(1),
    });

    if (passedComment) {
      batch.update(doc(db, "comments", passedComment.commentId), {
        replyNumber: increment(1),
      });
    }
  };

  const addCommentToUI = (commentId: string) => {
    setComments((prev) => [
      {
        authorId: userProfile.uid,
        authorImg: userProfile.userImg,
        authorUsername: userProfile.username,
        postAuthorId: post.authorId,
        postId: postId,
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
      parentCommentId: passedComment ? passedComment.commentId : "",
      parentType: passedComment ? "comment" : "post",
      body: comment,
      upvotes: 1,
      downvotes: 0,
      replyNumber: 0,
      timestamp: serverTimestamp(),
    });

    const batch = writeBatch(db);
    updateFirestoreDocs(commentRef.id, batch);
    sendNotification(commentRef.id, batch);
    await batch.commit();

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
      style={passedComment ? { margin: "12px" } : undefined}
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
