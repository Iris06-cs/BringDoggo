import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllReviews,
  getCurrentUserReviews,
  selectCurrentUserReviews,
  deleteReview,
} from "../../store/reviews";
import LoadingSpinner from "../LoadingSpinner";
import { getAllRestaurants, getRestaurantById } from "../../store/restaurants";
const UserReviews = () => {
  const dispatch = useDispatch();
  const allRestaurants = useSelector((state) => state.restaurants.restaurants);
  const currUser = useSelector((state) => state.session.user);
  const userReviews = useSelector((state) => selectCurrentUserReviews(state));
  useEffect(() => {
    // dispatch(getAllRestaurants()); //not getting all restaurant
    dispatch(getAllReviews());
    dispatch(getCurrentUserReviews());
  }, [dispatch]);
  const handleDeleteReview = (e, reviewId) => {
    e.preventDefault();
    dispatch(deleteReview(reviewId));
  };

  if (!userReviews) return <LoadingSpinner />;
  return (
    <>
      <h3>Reviews</h3>
      <div className="userprofile-fav-cards-container">
        {userReviews &&
          Object.values(userReviews).map((review, idx) => (
            <div key={idx} className="fav-card-container">
              <div className="fav-card-left-container">
                <div>Restaurant Info</div>
                <div>{review.reviewDetail}</div>
              </div>
              <div className="modify-fav-btns-container">
                <button
                  className="general-button"
                  onClick={(e) => handleDeleteReview(e, review.id)}
                >
                  Delete Review
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
export default UserReviews;
