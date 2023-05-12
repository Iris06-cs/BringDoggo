import { configureStore } from "@reduxjs/toolkit";
import { loadingMiddleware } from "./loadingMiddleware";
import loadingReducer from "./loadingMiddleware";
import sessionReducer from "./session";
import restaurantsReducer from "./restaurants";
import reviewsReducer from "./reviews";
import favoritesReducer from "./favorites";
const middleware = [loadingMiddleware];

if (process.env.NODE_ENV === "development") {
  const { logger } = require("redux-logger");
  middleware.push(logger);
}
const store = configureStore({
  reducer: {
    loader: loadingReducer,
    session: sessionReducer,
    restaurants: restaurantsReducer,
    reviews: reviewsReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
  devTools: process.env.NODE_ENV !== "production",
});
export default store;
