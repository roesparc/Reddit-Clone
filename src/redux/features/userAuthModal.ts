import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { INITIAL_USER_AUTH_MODAL } from "../../ts_common/initialStates";

const slice = createSlice({
  name: "userAuthModal",
  initialState: INITIAL_USER_AUTH_MODAL,
  reducers: {
    open: (state) => {
      state.isUserAuthOpen = true;
    },
    close: (state) => {
      state.isUserAuthOpen = false;
    },
    setLogInMode: (state) => {
      state.authMode = "logIn";
    },
    setSignUpMode: (state) => {
      state.authMode = "signUp";
    },
  },
});

export const { open, close, setLogInMode, setSignUpMode } = slice.actions;

export const selectIsUserAuthOpen = (state: RootState) =>
  state.userAuthModal.isUserAuthOpen;
export const selectAuthMode = (state: RootState) =>
  state.userAuthModal.authMode;

export default slice.reducer;
