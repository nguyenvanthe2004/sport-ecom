import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {
    userId: "",
    email: "",
    fullname: "",
    role: "",
  },
  loading: true,
};

export const userCurrentSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      console.log("==action.payload", action.payload);
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
    setLoading: (state) => {
      state.loading = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentUser, clearCurrentUser, setLoading } =
  userCurrentSlice.actions;

export default userCurrentSlice.reducer;
