import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: localStorage.getItem('userId') || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    clearUser(state) {
      state.userId = null;
    },
  },
});

export const { setUserId, clearUser } = userSlice.actions;
export default userSlice.reducer;