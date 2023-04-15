import { configureStore } from "@reduxjs/toolkit";
import userAuthModalReducer from "./features/userAuthModal";

const store = configureStore({
  reducer: {
    userAuthModal: userAuthModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
