import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {
    userId: "",
    email: "",
    fullname: "",
    role: "",
  },
};

export const userCurrentSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    clearCurrentUser: (state) => {
      state.currentUser = {
        userId: "",
        email: "",
        fullname: "",
        role: "",
      };
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentUser, clearCurrentUser } =
  userCurrentSlice.actions;

export default userCurrentSlice.reducer;
