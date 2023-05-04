import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { getReviewsByRestaurantId } from "../../../store/reviews";
import dateFormater from "../../../utils/dateFormater";
import Ratings from "../../AllRestaurantsPage/Ratings/Ratings";
import "./Reviews.css";
import placeHolderImg from "../../../image/user-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Reviews = ({ restaurantDetail }) => {
  const { restaurantId } = useParams();
  const currentUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews.reviewsById);
  const restaurantReviewIds = useSelector(
    (state) => state.reviews.reviewIdsByRestaurantId
  );
  const loadingReviews = useSelector((state) => state.reviews.loading);

  if (loadingReviews || !reviews) return <p>loading...</p>;
  // no login user==>render write review component
  //has login user==> user has exisiting review==>top review with edit delete button
  //has login user==>user has no exisiting review==> render add review component
  return (
    <div className="reviews-section-container">
      {!currentUser && (
        <div className="add-review-card-container">
          <div className="review-author-container">
            <div>
              <img
                alt="user-profile"
                src={placeHolderImg}
                style={{ width: "60px", borderRadius: "50%" }}
              />
            </div>
            <div className="review-author-info-container">
              <p>Username</p>
              <p>Date</p>
            </div>
          </div>
          <div>
            {/* hover over to show rating ratio,onclick=>add review page/login */}
            <div className="rating-bone-container">
              <div className="single-bone-container">
                <FontAwesomeIcon
                  icon="fa-solid fa-bone"
                  style={{ transform: "rotate(135deg)" }}
                />
                <span className="tooltip-text">Great</span>
              </div>
              <div className="single-bone-container">
                <FontAwesomeIcon
                  icon="fa-solid fa-bone"
                  style={{ transform: "rotate(135deg)" }}
                />
                <span className="tooltip-text">Good</span>
              </div>
              <div className="single-bone-container">
                <FontAwesomeIcon
                  icon="fa-solid fa-bone"
                  style={{ transform: "rotate(135deg)" }}
                />
                <span className="tooltip-text">Ok</span>
              </div>
              <div className="single-bone-container">
                <FontAwesomeIcon
                  icon="fa-solid fa-bone"
                  style={{ transform: "rotate(135deg)" }}
                />
                <span className="tooltip-text">Not Good</span>
              </div>
              <div className="single-bone-container">
                <FontAwesomeIcon
                  icon="fa-solid fa-bone"
                  style={{ transform: "rotate(135deg)" }}
                />
                <span className="tooltip-text">Bad</span>
              </div>
            </div>

            <p>
              Start your review of{" "}
              <span id="review-restaurant-name">{restaurantDetail.name}</span>
            </p>
          </div>
        </div>
      )}
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
