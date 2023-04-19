import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserProfile } from "../../ts_common/interfaces";
import { INITIAL_USER_PROFILE } from "../../ts_common/initialStates";

interface Auth {
  currentUser: string | undefined;
  userProfile: UserProfile;
}

const initialState: Auth = {
  currentUser: undefined,
  userProfile: INITIAL_USER_PROFILE,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateCurrentUser: (state, action: PayloadAction<string | undefined>) => {
      state.currentUser = action.payload;
      console.log(state.currentUser);
    },
    updateUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.userProfile = { ...action.payload };
    },
  },
});

export const { updateCurrentUser, updateUserProfile } = slice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectUserProfile = (state: RootState) => state.auth.userProfile;

export default slice.reducer;
