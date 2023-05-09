import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
const FunctionBtns = ({ hasReview, name, currentUserReview, isFav }) => {
  const { restaurantId } = useParams();
  const history = useHistory();
  const currentUser = useSelector((state) => state.session.user);
  const handleCreateReview = (e) => {
    e.preventDefault();
    history.push(`/restaurants/${restaurantId}/reviews/new?name=${name}`);
  };

  const handleUpdateReview = (e) => {
    e.preventDefault();
    const path = `/restaurants/${restaurantId}/reviews/new`;
    const param = currentUserReview
      ? `?name=${name}&rating=${currentUserReview.stars}`
      : `?name=${name}`;

    history.push(path + param);
  };
  return (
    <div className="func-btns-container">
      {/* if has login user && without review||no login user */}
      {!currentUser && (
        <OpenModalButton
          buttonText={
            <>
              <FontAwesomeIcon
                icon="fa-solid fa-bone"
                className="display-bone"
              />
              Write a review
            </>
          }
          // onItemClick={closeMenu}
          modalComponent={<SignupFormModal />}
        />
      )}
      {currentUser && !hasReview && (
        <button className="write-review-btn" onClick={handleCreateReview}>
          <FontAwesomeIcon icon="fa-solid fa-bone" />
          Write a review
        </button>
      )}

      {hasReview && (
        <button className="write-review-btn" onClick={handleUpdateReview}>
          <FontAwesomeIcon icon="fa-solid fa-bone" />
          Update review
        </button>
      )}
      <button id="add-photo-btn">
        <FontAwesomeIcon icon="fa-solid fa-camera-retro" />
        Add photo
      </button>
      {/* no login user，on click login popup */}
      {/* user logged in, has not added to fav, onclick popup add to/create collection popup */}
      {/* user logged in,already added to fav,button added fav, onclick remove or change to other collection, or create new collection */}
      {!currentUser && (
        <OpenModalButton
          buttonText={
            <>
              <FontAwesomeIcon
                icon="fa-solid fa-heart"
                className="display-bone"
              />
              Favorite
            </>
          }
          // onItemClick={closeMenu}
          modalComponent={<SignupFormModal />}
        />
      )}
      {currentUser && (
        <button>
          <FontAwesomeIcon icon="fa-solid fa-heart" />
          Favorite
        </button>
      )}
    </div>
  );
};
export default FunctionBtns;
