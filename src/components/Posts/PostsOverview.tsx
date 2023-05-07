import { Post } from "../../ts_common/interfaces";
import LoadingPosts from "./LoadingPosts";
import PostDisplay from "./PostDisplay";

interface Props {
  posts: Array<Post>;
}

const PostsOverview = ({ posts }: Props) => {
  return (
    <>
      {!posts.length ? (
        <LoadingPosts />
      ) : (
        <div>
          {posts.map((post) => (
            <PostDisplay key={post.postId} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default PostsOverview;
