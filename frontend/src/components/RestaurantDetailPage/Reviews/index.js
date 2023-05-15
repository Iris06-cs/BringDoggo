import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import dateFormater from "../../../utils/dateFormater";
import Ratings from "../../AllRestaurantsPage/Ratings/Ratings";
import "./Reviews.css";
import placeHolderImg from "../../../image/user-icon.png";

import RatingTooltip from "./RatingTooltip";
import { deleteReview } from "../../../store/reviews";
import { getRestaurantById } from "../../../store/restaurants";
const Reviews = ({ restaurantDetail, setHasReview }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state) => state.session.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const restaurantReviews = restaurantDetail.reviews;
  useEffect(() => {
    if (!showDropdown) return;

    const closeMenu = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showDropdown]);

  if (!restaurantReviews) return <p>loading...</p>;
  const currUserReview = restaurantReviews.find(
    (review) => currentUser && review.authorId === currentUser.id
  );
  const otherReviews = restaurantReviews.filter(
    (review) => !currentUser || review.authorId !== currentUser.id
  );
  const reviews = currUserReview
    ? [currUserReview, ...otherReviews]
    : otherReviews;
  const dropdownCls =
    "modify-review-dropdown" + (showDropdown ? "" : " hidden");
  const closeDropdown = () => setShowDropdown(false);
  const openDropdown = () => {
    if (showDropdown) setShowDropdown(false);
    else setShowDropdown(true);
  };

  const handleDelete = async (reviewId) => {
    closeDropdown();
    setHasReview(false);
    await dispatch(deleteReview(reviewId));
    // fetch updated restaurant
    await dispatch(getRestaurantById(restaurantDetail.id));
  };
  const handleUpdate = async () => {
    const restaurantId = restaurantDetail.id;
    const name = restaurantDetail.name;
    const path = `/restaurants/${restaurantId}/reviews/new`;
    const param = currUserReview
      ? `?name=${name}&rating=${currUserReview.stars}`
      : `?name=${name}`;

    history.push(path + param);
  };

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
      {reviews.length ? (
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
              {/* edit/delete funtionality for current user */}
              {currentUser && currentUser.id === review.authorId && (
                <>
                  <button className="edit-review-btn" onClick={openDropdown}>
                    &middot;&middot;&middot;
                  </button>
                  <ul className={dropdownCls} ref={dropdownRef}>
                    <li onClick={() => handleUpdate()}>Update Review</li>
                    <li onClick={() => handleDelete(review.id)}>
                      Delete Review
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <h3>No Reviews Yet</h3>
      )}
    </div>
  );
};

export default Reviews;
