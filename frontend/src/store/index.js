import { configureStore } from "@reduxjs/toolkit";
import { loadingMiddleware } from "./loadingMiddleware";
import sessionReducer from "./session";
import restaurantsReducer from "./restaurants";
const middleware = [loadingMiddleware];

if (process.env.NODE_ENV === "development") {
  const { logger } = require("redux-logger");
  middleware.push(logger);
}
const store = configureStore({
  reducer: {
    session: sessionReducer,
    restaurants: restaurantsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
  devTools: process.env.NODE_ENV !== "production",
});
export default store;
