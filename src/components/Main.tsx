import { Route, Routes } from "react-router-dom";
import UserProfileDisplay from "./UserProfile/UserProfileDisplay";
import UserSettings from "./UserProfile/UserSettings";
import CommunityPage from "./Communities/CommunityPage";
import CreatePost from "./CreatePost/CreatePost";
import PostPage from "./Posts/PostPage";

const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/user/:username" element={<UserProfileDisplay />} />

        <Route
          path="/user/:username/comments"
          element={<UserProfileDisplay />}
        />

        <Route path="/user/:username/saved" element={<UserProfileDisplay />} />

        <Route
          path="/user/:username/upvoted"
          element={<UserProfileDisplay />}
        />

        <Route
          path="/user/:username/downvoted"
          element={<UserProfileDisplay />}
        />

        <Route path="/settings/profile" element={<UserSettings />} />

        <Route path="/r/:subName" element={<CommunityPage />} />

        <Route path="/submit" element={<CreatePost />} />

        <Route path="/r/:subName/submit" element={<CreatePost />} />

        <Route path="/r/:subName/:postId" element={<PostPage />} />
      </Routes>
    </main>
  );
};

export default Main;
