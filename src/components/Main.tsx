import { Route, Routes } from "react-router-dom";
import UserProfile from "./UserProfile/UserProfile";

const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/user/:username/comments" element={<UserProfile />} />
        <Route path="/user/:username/saved" element={<UserProfile />} />
        <Route path="/user/:username/upvoted" element={<UserProfile />} />
        <Route path="/user/:username/downvoted" element={<UserProfile />} />
      </Routes>
    </main>
  );
};

export default Main;
