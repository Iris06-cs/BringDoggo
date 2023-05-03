import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getReviewsByRestaurantId } from "../../../store/reviews";
import dateFormater from "../../../utils/dateFormater";
import Ratings from "../../AllRestaurantsPage/Ratings/Ratings";
import "./Reviews.css";
import placeHolderImg from "../../../image/user-icon.png";
const Reviews = () => {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviewsById);
  const restaurantReviewIds = useSelector(
    (state) => state.reviews.reviewIdsByRestaurantId
  );
  const loadingReviews = useSelector((state) => state.reviews.loading);

  useEffect(() => {
    dispatch(getReviewsByRestaurantId(restaurantId));
  }, [dispatch, restaurantId]);

  if (loadingReviews || !reviews) return <p>loading...</p>;

  return (
    <div className="reviews-section-container">
      {restaurantReviewIds[restaurantId] &&
        restaurantReviewIds[restaurantId].map((reviewId, idx) => (
          <div className="review-card-container" key={idx}>
            <div className="review-author-container">
              <div>
                <img
                  alt="user-profile"
                  src={placeHolderImg}
                  style={{ width: "60px", borderRadius: "50%" }}
                />
              </div>
              <div className="review-author-info-container">
                <p>
                  {reviews[reviewId].user.firstname}{" "}
                  {reviews[reviewId].user.lastname[0]}.
                </p>
                <p>{dateFormater(reviews[reviewId].updatedAt)}</p>
              </div>
            </div>
            <div className="review-detail-container">
              <p>{reviews[reviewId].reviewDetail}</p>
            </div>
            <div className="review-rating-container">
              <Ratings avgRating={reviews[reviewId].stars} />
              {/* edit/delete funtionality */}
              <button className="edit-review-btn">
                &middot;&middot;&middot;
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Reviews;
