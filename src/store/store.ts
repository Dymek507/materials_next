import { configureStore } from "@reduxjs/toolkit";
import constructionReducer from "./constructionSlice";
import lastProductReducer from "./lastProductSlice";
import uiReducer from "./ui-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      construction: constructionReducer,
      lastProduct: lastProductReducer,
      ui: uiReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
