import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  about: string;
  userTheme: "light" | "dark";
  userImg: string;
  coverImg: string;
  cakeDay: string;
  upvotedPosts: Array<string>;
  downvotedPosts: Array<string>;
  savedPosts: Array<string>;
}

export interface PostRaw {
  subId: string;
  authorId: string;
}

export interface Post extends PostRaw {
  postId: string;
  authorUsername: string;
  subName: string;
  subImg: string;
  title: string;
  body: string;
  img: string;
  upvotes: number;
  downvotes: number;
  commentNumber: number;
  timestamp: Timestamp | null;
}
