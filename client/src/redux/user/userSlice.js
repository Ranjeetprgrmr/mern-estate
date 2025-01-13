import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  userImage: null, // add this line to store the uploaded image
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      console.log("action.payload:", action.payload);
      state.loading = false;
      state.currentUser = action.payload;
      state.userImage = action.payload.otherDetails.avatar;
      console.log("currentUser:", state.currentUser);
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    uploadImage: (state, action) => {
      console.log("action.payload of uploadImage:", action.payload);
      state.userImage = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      console.log('updateUserSuccess action dispatched with payload:', action.payload);
      state.loading = false;
      state.currentUser = action.payload;
      state.userImage = action.payload.avatar; // add this line
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.userImage = null; // add this line to clear the image state
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  uploadImage,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
