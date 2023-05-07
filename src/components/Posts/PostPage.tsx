import { useEffect, useState } from "react";
import stylesOuter from "../../styles/shared/LocationMainContent.module.css";
import { Post } from "../../ts_common/interfaces";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import PostDisplay from "./PostDisplay";
import { INITIAL_POST_DATA } from "../../ts_common/initialStates";
import { completePostsInfo } from "../../functions/fetchPosts";
import PostComments from "../Comments/PostComments";
import styles from "../../styles/posts/PostPage.module.css";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post>(INITIAL_POST_DATA);

  useEffect(() => {
    const getPost = async () => {
      const docSnap = await getDoc(doc(db, "posts", postId!));
      const completePost = await completePostsInfo([docSnap]);
      setPost(completePost[0]);
    };
    getPost();
  }, [postId]);

  return (
    <>
      {!!post.postId && (
        <div className={stylesOuter.contentWrapper}>
          <div className={styles.root}>
            <PostDisplay post={post} mode="single" />

            <PostComments />
          </div>
        </div>
      )}
    </>
  );
};

export default PostPage;
