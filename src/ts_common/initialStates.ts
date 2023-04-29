import { Post, UserProfile } from "./interfaces";

export const INITIAL_USER_PROFILE: UserProfile = {
  uid: "",
  username: "",
  displayName: "",
  about: "",
  userTheme: "light",
  userImg: "",
  coverImg: "",
  cakeDay: "",
  upvotedPosts: [],
  downvotedPosts: [],
  savedPosts: [],
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
