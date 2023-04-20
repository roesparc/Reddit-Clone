import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Theme {
  currentTheme: "light" | "dark";
}

const initialState: Theme = {
  currentTheme: "light",
};

const slice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
    },

    setUserTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { toggleTheme, setUserTheme } = slice.actions;

export const selectCurrentTheme = (state: RootState) =>
  state.theme.currentTheme;

export default slice.reducer;
