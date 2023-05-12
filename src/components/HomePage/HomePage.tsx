import { useFetchPosts } from "../../functions/fetchPosts";
import stylesLocationMain from "../../styles/shared/LocationMainContent.module.css";
import stylesPostContainer from "../../styles/shared/SharedPostsContainer.module.css";

import PostsOverview from "../Posts/PostsOverview";
import PostSorting from "../Posts/PostsSorting";
import { useState } from "react";
import NothingToShow from "../shared/NothingToShow";
import { ImSpinner2 } from "react-icons/im";
import HomeInfoCard from "./HomeInfoCard";

const HomePage = () => {
  const [order, setOrder] = useState<"timestamp" | "upvotes">("timestamp");
  const { posts, isLoading, hasMore, isCollectionEmpty } = useFetchPosts(
    undefined,
    undefined,
    order,
    true
  );

  return (
    <div className={stylesLocationMain.contentWrapper}>
      <div className={stylesPostContainer.root}>
        {isCollectionEmpty ? (
          <NothingToShow />
        ) : (
          <>
            <PostSorting setOrder={setOrder} order={order} />
            <PostsOverview posts={posts} />

            {posts.length > 0 && isLoading && (
              <ImSpinner2 className={stylesPostContainer.loadingPostsSpinner} />
            )}

            {!hasMore && posts.length >= 9 && (
              <p className={stylesPostContainer.noMorePosts}>No more posts</p>
            )}
          </>
        )}
      </div>

      <HomeInfoCard />
    </div>
  );
};

export default HomePage;
