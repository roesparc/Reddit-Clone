import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetchComments } from "../../functions/fetchComments";
import CommentDisplay from "./CommentDisplay";
import styles from "../../styles/comments/PostComments.module.css";
import stylesBtn from "../../styles/elements/buttons.module.css";

const PostComments = () => {
  const { postId } = useParams();
  const [isPostValid, setIsPostValid] = useState<boolean>(false);
  const [order] = useState<"timestamp" | "upvotes">("timestamp");
  const { comments, isLoading, hasMore, isCollectionEmpty } = useFetchComments(
    "postId",
    postId!,
    order,
    true
  );

  return (
    <div className={styles.root}>
      <div className={styles.commentTextArea}>
        <textarea rows={1} placeholder="What are your thoughts?"></textarea>

        <div>
          <button
            className={stylesBtn.btnVariantOne}
            disabled={!isPostValid && true}
          >
            Comment
          </button>
        </div>
      </div>

      <div>
        {comments.map((comment) => (
          <CommentDisplay key={comment.commentId} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default PostComments;
