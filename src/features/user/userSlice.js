import { createSlice } from "@reduxjs/toolkit";

/**
 * @typedef {Object} UserStruct
 * @property {?string} userId
 */

/**
 * @typedef {Object} UserStore
 * @property {UserStruct} user
 */

/** @type {UserStruct} */
const initialState = {
  userId: null,
};

const userSlice = createSlice({
  name: "user",
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

/**
 * @param {UserStore} state
 * @returns {?string}
 */
export const selectUserId = (state) => state.user.userId;

export default userSlice.reducer;
