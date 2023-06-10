import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fas } from "@fortawesome/free-solid-svg-icons";

import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import AllRestaurantsPage from "./components/AllRestaurantsPage";
import Footer from "./components/Footer";
import RestaurantDetailPage from "./components/RestaurantDetailPage";
import AddReviewPage from "./components/AddReviewPage";
import UserProfilePage from "./components/UserProfilePage";
import { getAllRestaurants } from "./store/restaurants";
import { getAllRestaurantImages } from "./store/restaurantImage";
import AboutPage from "./components/AboutPage";
import HomePage from "./components/HomePage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
    dispatch(getAllRestaurants());
    dispatch(getAllRestaurantImages());
  }, [dispatch]);

  // library.add(fas);
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <main>
        {isLoaded && (
          <Switch>
            <Route path="/restaurants/:restaurantId/reviews/new">
              <AddReviewPage />
            </Route>
            <Route path="/restaurants/:restaurantId">
              <RestaurantDetailPage />
            </Route>
            <Route exact path="/">
              <HomePage />
            </Route>
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
            <Route exact path="/restaurants">
              <AllRestaurantsPage />
            </Route>
            <Route exact path="/about">
              <AboutPage />
            </Route>
          </Switch>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
