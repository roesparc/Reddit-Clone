export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  about: string;
  userTheme: "light" | "dark";
  userImg: string;
  cakeDay: string;
}
