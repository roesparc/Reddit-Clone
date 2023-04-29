import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserProfile } from "../../ts_common/interfaces";
import { INITIAL_USER_PROFILE } from "../../ts_common/initialStates";

interface Auth {
  userProfile: UserProfile;
}

const initialState: Auth = {
  userProfile: INITIAL_USER_PROFILE,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.userProfile = { ...action.payload };
    },
  },
});

export const { updateUserProfile } = slice.actions;

export const selectUserProfile = (state: RootState) => state.auth.userProfile;

export default slice.reducer;
