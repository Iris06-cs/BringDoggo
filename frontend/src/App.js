import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import AllRestaurantsPage from "./components/AllRestaurantsPage";
import Footer from "./components/Footer";
import RestaurantDetailPage from "./components/RestaurantDetailPage";
import AddReviewPage from "./components/AddReviewPage";
import LoadingSpinner from "./components/LoadingSpinner";
import UserProfilePage from "./components/UserProfilePage";
import UserReviews from "./components/UserProfilePage/UserReviews";
import UserFavorites from "./components/UserProfilePage/UserFavorites";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  // const runLoader = useSelector((state) => state.loader.loading);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  library.add(fas);
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <main>
        {/* {runLoader && <LoadingSpinner />} */}
        {isLoaded && (
          <Switch>
            <Route path="/login">
              <LoginFormPage />
            </Route>
            <Route path="/signup">
              <SignupFormPage />
            </Route>
            <Route path="/restaurants/:restaurantId/reviews/new">
              <AddReviewPage />
            </Route>
            <Route path="/restaurants/:restaurantId">
              <RestaurantDetailPage />
            </Route>
            {/* will add homepage */}
            <Route
              exact
              path={[
                "/users/current/profile",
                "/users/current/reviews",
                "/users/current/favorites",
              ]}
            >
              <UserProfilePage />
            </Route>
            <Route path={["/", "/restaurants"]}>
              <AllRestaurantsPage />
            </Route>
          </Switch>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
