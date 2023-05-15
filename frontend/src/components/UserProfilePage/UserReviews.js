import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllReviews,
  getCurrentUserReviews,
  selectCurrentUserReviews,
  deleteReview,
} from "../../store/reviews";
import LoadingSpinner from "../LoadingSpinner";
import { getAllRestaurants } from "../../store/restaurants";
import { NavLink } from "react-router-dom";
const UserReviews = ({ setIsDeleted }) => {
  const dispatch = useDispatch();
  const allRestaurants = useSelector((state) => state.restaurants.restaurants);
  //   const currUser = useSelector((state) => state.session.user);
  const userReviews = useSelector((state) => selectCurrentUserReviews(state));
  useEffect(() => {
    dispatch(getAllRestaurants());
    dispatch(getAllReviews());
    dispatch(getCurrentUserReviews());
  }, [dispatch]);
  const handleDeleteReview = async (e, reviewId) => {
    e.preventDefault();
    await dispatch(deleteReview(reviewId));
    setIsDeleted((prev) => prev + 1);
  };

  if (!userReviews || Object.values(allRestaurants).length < 1)
    return <LoadingSpinner />;
  return (
    <>
      <h3>Reviews</h3>
      <div className="userprofile-fav-cards-container">
        {userReviews &&
          Object.values(allRestaurants).length > 0 &&
          Object.values(userReviews).map((review, idx) => (
            <div key={idx} className="fav-card-container">
              <div className="fav-card-left-container">
                <div>
                  <NavLink
                    className="restaurant-name-link"
                    to={`/restaurants/${review.restaurantId}`}
                  >
                    {allRestaurants[review.restaurantId].name}
                  </NavLink>
                </div>
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
