import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import constructionWorksReducer from "./slices/constructionWorksSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    constructionWorks: constructionWorksReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
