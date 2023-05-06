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
            <Route path="/restaurants">
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
