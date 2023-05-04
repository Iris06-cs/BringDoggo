import React from "react";
import { useSelector } from "react-redux";
import dateFormater from "../../../utils/dateFormater";
import Ratings from "../../AllRestaurantsPage/Ratings/Ratings";
import "./Reviews.css";
import placeHolderImg from "../../../image/user-icon.png";

import RatingTooltip from "./RatingTooltip";
const Reviews = ({ restaurantDetail }) => {
  const currentUser = useSelector((state) => state.session.user);
  const reviews = restaurantDetail.reviews;

  if (!reviews) return <p>loading...</p>;
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
            <RatingTooltip restaurantName={restaurantDetail.name} />
            <p>
              Start your review of{" "}
              <span id="review-restaurant-name">{restaurantDetail.name}</span>
            </p>
          </div>
        </div>
      )}
      {reviews &&
        reviews.map((review, idx) => (
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
                  {review.user.firstname} {review.user.lastname[0]}.
                </p>
                <p>{dateFormater(review.updatedAt)}</p>
              </div>
            </div>
            <div className="review-detail-container">
              <p>{review.reviewDetail}</p>
            </div>
            <div className="review-rating-container">
              <Ratings avgRating={review.stars} />
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
