import { createSlice } from "@reduxjs/toolkit";

//Redux
/*
- Config
+ Store nơi chứa các reducers, reducers quản lý state + action
+ Slice để tạo reducers(hàm lấy state + action làm tham số)

- Ứng dụng: dùng useSelector(state => state.user) để lấy state, dispatch(action) để thay đổi state
*/

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user123",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;
