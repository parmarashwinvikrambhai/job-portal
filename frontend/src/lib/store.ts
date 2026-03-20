import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth-slice";
import jobsReducer from "./features/jobs/jobs-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
