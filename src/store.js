import { configureStore } from "@reduxjs/toolkit";
import { apiGoods } from "./services/apiGoods.js";
import userReducer from "./features/user/userSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [apiGoods.reducerPath]: apiGoods.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiGoods.middleware),
});
