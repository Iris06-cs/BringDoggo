import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FunctionBtns = ({ hasReview }) => {
  const currentUser = useSelector((state) => state.session.user);

  return (
    <div className="func-btns-container">
      {/* if has login user && without review||no login user */}
      {(!hasReview || !currentUser) && (
        <button className="write-review-btn">
          <FontAwesomeIcon icon="fa-solid fa-bone" />
          Write a review
        </button>
      )}
      {hasReview && (
        <button className="write-review-btn">
          <FontAwesomeIcon icon="fa-solid fa-bone" />
          Update review
        </button>
      )}
      <button>
        <FontAwesomeIcon icon="fa-solid fa-camera-retro" />
        Add photo
      </button>
      <button>
        <FontAwesomeIcon icon="fa-solid fa-heart" />
        Favorite
      </button>
    </div>
  );
};
export default FunctionBtns;
