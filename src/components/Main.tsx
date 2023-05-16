import { Route, Routes } from "react-router-dom";
import UserProfileDisplay from "./UserProfile/UserProfileDisplay";
import UserSettings from "./UserProfile/UserSettings";
import CommunityPage from "./Communities/CommunityPage";
import CreatePost from "./CreatePost/CreatePost";
import PostPage from "./Posts/PostPage";
import HomePage from "./HomePage/HomePage";
import { useAppSelector } from "../redux/hooks";
import { selectUserProfile } from "../redux/features/auth";
import AccessDenied from "./shared/AccessDenied";

const Main = () => {
  const userProfile = useAppSelector(selectUserProfile);

  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />

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

        <Route
          path="/settings/profile"
          element={
            userProfile.username ? (
              <UserSettings />
            ) : (
              <AccessDenied fullPage={true} />
            )
          }
        />

        <Route path="/r/:subName" element={<CommunityPage />} />

        <Route
          path="/submit"
          element={
            userProfile.username ? (
              <CreatePost />
            ) : (
              <AccessDenied fullPage={true} />
            )
          }
        />

        <Route
          path="/r/:subName/submit"
          element={
            userProfile.username ? (
              <CreatePost />
            ) : (
              <AccessDenied fullPage={true} />
            )
          }
        />

        <Route path="/r/:subName/:postId" element={<PostPage />} />
      </Routes>
    </main>
  );
};

export default Main;
