import { configureStore } from "@reduxjs/toolkit";
import userAuthModalReducer from "./features/userAuthModal";
import authReducer from "./features/auth";
import themeReducer from "./features/theme";

const store = configureStore({
  reducer: {
    userAuthModal: userAuthModalReducer,
    auth: authReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
