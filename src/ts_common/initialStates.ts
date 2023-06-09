import {
  Comment,
  Community,
  Notification,
  Post,
  UserProfile,
} from "./interfaces";

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
  upvotedComments: [],
  downvotedComments: [],
  notifications: [],
};

export const INITIAL_COMMUNITY: Community = {
  id: "",
  name: "",
  description: "",
  img: "",
  coverImg: "",
  postNumber: 0,
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

export const INITIAL_COMMENT_DATA: Comment = {
  commentId: "",
  parentType: "",
  parentCommentId: "",
  postId: "",
  authorId: "",
  authorImg: "",
  subId: "",
  authorUsername: "",
  subName: "",
  subImg: "",
  postTitle: "",
  postAuthorId: "",
  body: "",
  upvotes: 0,
  downvotes: 0,
  replyNumber: 0,
  timestamp: null,
};

export const INITIAL_NOTIFICATION_DATA: Notification = {
  isRead: false,
  notificationId: "",
  authorId: "",
  forUserId: "",
  subId: "",
  postId: "",
  targetId: "",
  authorUsername: "",
  authorImg: "",
  subName: "",
  notification: "",
  body: "",
  type: null,
  originUrl: "",
  timestamp: null,
};
