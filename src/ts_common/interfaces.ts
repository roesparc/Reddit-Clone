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
  upvotedComments: Array<string>;
  downvotedComments: Array<string>;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  img: string;
  coverImg: string;
  postNumber: number;
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

export interface CommentRaw {
  postId: string;
  authorId: string;
  subId: string;
}

export interface Comment extends CommentRaw {
  commentId: string;
  authorUsername: string;
  authorImg: string;
  subName: string;
  subImg: string;
  postTitle: string;
  postAuthorId: string;
  body: string;
  upvotes: number;
  downvotes: number;
  replyNumber: number;
  timestamp: Timestamp | null;
}
