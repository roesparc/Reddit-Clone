import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UserAuthModalState {
  isUserAuthOpen: boolean;
  authMode: "logIn" | "signUp";
}

const initialState: UserAuthModalState = {
  isUserAuthOpen: false,
  authMode: "logIn",
};

const slice = createSlice({
  name: "userAuthModal",
  initialState,
  reducers: {
    openAuthModal: (state) => {
      state.isUserAuthOpen = true;
    },
    closeAuthModal: (state) => {
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

export const { openAuthModal, closeAuthModal, setLogInMode, setSignUpMode } =
  slice.actions;

export const selectIsUserAuthOpen = (state: RootState) =>
  state.userAuthModal.isUserAuthOpen;
export const selectAuthMode = (state: RootState) =>
  state.userAuthModal.authMode;

export default slice.reducer;
