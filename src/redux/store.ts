import { configureStore } from "@reduxjs/toolkit";
import userAuthModalReducer from "./features/userAuthModal";
import authReducer from "./features/auth";

const store = configureStore({
  reducer: {
    userAuthModal: userAuthModalReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
