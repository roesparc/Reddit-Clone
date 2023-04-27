import { Route, Routes } from "react-router-dom";
import UserProfileDisplay from "./UserProfile/UserProfileDisplay";

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
      </Routes>
    </main>
  );
};

export default Main;
