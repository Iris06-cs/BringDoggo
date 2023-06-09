import { useDispatch, useSelector } from "react-redux";
import {
  getAllReviews,
  getCurrentUserReviews,
  selectCurrentUserReviews,
} from "../../store/reviews";
import {
  getAllFavs,
  getCurrentUserFavs,
  selectCurrUserFavs,
} from "../../store/favorites";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

import Ratings from "../AllRestaurantsPage/Ratings/Ratings";
import { NavLink } from "react-router-dom";

const ProfileOverview = () => {
  const dispatch = useDispatch();
  const {
    userReviews,
    userFavs,
    loader,
    userFavIds,
    userReviewIds,
    allRestaurants,
  } = useSelector((state) => ({
    userReviews: selectCurrentUserReviews(state),
    userFavs: selectCurrUserFavs(state),
    userFavIds: state.favorites.currentUserFavoritesId,
    userReviewIds: state.reviews.currentUserReviewIds,
    loader: state.loader.loading,
    allRestaurants: state.restaurants.restaurants,
  }));
  const [lastReview, setLastReview] = useState();
  const [lastFav, setLastFav] = useState();
  useEffect(() => {
    dispatch(getAllFavs());
    dispatch(getAllReviews());
    dispatch(getCurrentUserReviews());
    dispatch(getCurrentUserFavs());
  }, [dispatch]);
  useEffect(() => {
    if (allRestaurants && userFavs)
      setLastFav(userFavs[userFavIds[userFavIds.length - 1]]);
    if (allRestaurants && userReviews)
      setLastReview(userReviews[userReviewIds[userReviewIds.length - 1]]);
  }, [userFavs, userFavIds, userReviewIds, userReviews, allRestaurants]);
  if (
    loader ||
    !userReviews ||
    !userFavs ||
    Object.values(allRestaurants).length < 1
  )
    return <LoadingSpinner />;

  return (
    <>
      <h3>Latest Activity </h3>
      {!lastFav && !lastReview && <p>No recent activities.</p>}
      {Object.values(allRestaurants).length > 0 && lastReview && (
        <>
          <p>Recent Review</p>
          <div className="fav-card-left-container">
            <div className="fav-title-row">
              <NavLink
                className="restaurant-name-link"
                to={`/restaurants/${lastReview.restaurantId}`}
              >
                {" "}
                {allRestaurants[lastReview.restaurantId].name}
              </NavLink>
            </div>
            <div className="restaurant-review-info">
              <div>{lastReview.reviewDetail}</div>
              <Ratings avgRating={lastReview.stars} />
            </div>
          </div>
        </>
      )}

      {Object.values(allRestaurants).length > 0 && lastFav && (
        <>
          <p>Recent Favorite Collection</p>
          <div className="fav-card-left-container">
            <div className="fav-title-row">{lastFav.title}</div>
            <div>{lastFav.description}</div>
            <div className="fav-collection-info">
              <div>{lastFav.isPublic ? "Public" : "Non-Public"}</div>
              <div>{Object.values(lastFav.restaurants).length}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default ProfileOverview;
