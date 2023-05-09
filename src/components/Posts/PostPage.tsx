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
import CommunityInfo from "../Communities/CommunityInfo";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post>(INITIAL_POST_DATA);

  useEffect(() => {
    const getPost = async () => {
      const docSnap = await getDoc(doc(db, "posts", postId!));
      const completePost = await completePostsInfo([docSnap]);
      setPost(completePost[0]);
    };
    setPost(INITIAL_POST_DATA);
    getPost();
  }, [postId]);

  return (
    <>
      {!!post.postId && (
        <div className={stylesOuter.contentWrapper}>
          <div className={styles.root}>
            <PostDisplay post={post} mode="single" />

            <PostComments setPost={setPost} post={post} />
          </div>

          <CommunityInfo subId={post.subId} />
        </div>
      )}
    </>
  );
};

export default PostPage;
