import { Post, UserProfile } from "./interfaces";

export const INITIAL_USER_PROFILE: UserProfile = {
  uid: "null",
  username: "",
  displayName: "",
  about: "",
  userTheme: "light",
  userImg: "",
  cakeDay: "",
};

export const INITIAL_POST_DATA: Post = {
  postId: "",
  authorId: "",
  authorUsername: "",
  subId: "",
  subName: "",
  subImg: "",
  title: "",
  body: "",
  img: "",
  upvotes: 0,
  downvotes: 0,
  commentNumber: 0,
  timestamp: null,
};
