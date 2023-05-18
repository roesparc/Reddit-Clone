import { useEffect, useState } from "react";
import stylesOuter from "../../styles/shared/LocationMainContent.module.css";
import { Post } from "../../ts_common/interfaces";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import PostDisplay from "./PostDisplay";
import { INITIAL_POST_DATA } from "../../ts_common/initialStates";
import { completePostsInfo } from "../../hooks/useFetchPosts";
import PostComments from "../Comments/PostComments";
import styles from "../../styles/posts/PostPage.module.css";
import CommunityInfo from "../Communities/CommunityInfo";
import LoadingPosts from "./LoadingPosts";
import PostNotFound from "./PostNotFound";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post>(INITIAL_POST_DATA);
  const [postExist, setPostExist] = useState<boolean>(true);
  const [isPostDeleting, setIsPostDeleting] = useState<boolean>(false);

  useEffect(() => {
    const getPost = async () => {
      const docSnap = await getDoc(doc(db, "posts", postId!));

      if (docSnap.exists()) {
        const completePost = await completePostsInfo([docSnap]);
        setPost(completePost[0]);
      } else {
        setPostExist(false);
      }
    };
    setPostExist(true);
    setPost(INITIAL_POST_DATA);
    getPost();
  }, [postId]);

  return postExist ? (
    <div className={stylesOuter.contentWrapper}>
      {post.postId.length ? (
        <div className={styles.root}>
          <PostDisplay
            post={post}
            mode="single"
            isPostDeleting={isPostDeleting}
            setIsPostDeleting={setIsPostDeleting}
          />

          <PostComments
            setPost={setPost}
            post={post}
            isPostDeleting={isPostDeleting}
          />
        </div>
      ) : (
        <div className={styles.root}>
          <LoadingPosts posts={[1]} />
        </div>
      )}

      <CommunityInfo subId={post.subId} />
    </div>
  ) : (
    <PostNotFound />
  );
};

export default PostPage;
