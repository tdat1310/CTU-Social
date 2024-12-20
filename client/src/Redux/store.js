import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import notifyReducer from "./slices/notifySlice";
import chatReducer from "./slices/chatSlice";
import globalReducer from "./slices/globalSlice";
import tagReducer from "./slices/tagSlice";
import groupReducer from "./slices/groupSlice";
import adminReduder from "./slices/adminSlice"
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  blog: blogReducer,
  notify: notifyReducer,
  chat: chatReducer,
  global: globalReducer,
  tag: tagReducer,
  group: groupReducer,
  admin: adminReduder
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
