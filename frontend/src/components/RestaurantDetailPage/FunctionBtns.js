import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import FavoriteCollectionModal from "../FavoriteCollectionModal";
import NewFavoriteCollectionForm from "../NewFavoriteCollectionForm";
import { selectCurrUserFavs } from "../../store/favorites";
import NewImageModal from "./NewImageModal";
const FunctionBtns = ({
  hasReview,
  name,
  currentUserReview,
  isFav,
  setIsFav,
}) => {
  const { restaurantId } = useParams();
  const history = useHistory();
  const { currentUser, currUserFavs } = useSelector((state) => ({
    currentUser: state.session.user,
    currUserFavs: selectCurrUserFavs(state),
  }));
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
  const renderOpenModalButton = (buttonText, modalComponent) => (
    <OpenModalButton
      buttonText={
        <>
          {buttonText === "Write a review" && (
            <FontAwesomeIcon icon="fa-solid fa-bone" className="display-bone" />
          )}
          {buttonText.includes("Favorite") && (
            <FontAwesomeIcon
              icon="fa-solid fa-heart"
              className="display-bone"
            />
          )}
          {buttonText === "Add photo" && (
            <FontAwesomeIcon
              icon="fa-solid fa-camera-retro"
              className="display-bone"
            />
          )}

          {buttonText}
        </>
      }
      modalComponent={modalComponent}
    />
  );
  return (
    <div className="func-btns-container">
      {/* if has login user && without review||no login user */}
      {!currentUser &&
        renderOpenModalButton("Write a review", <SignupFormModal />)}
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

      {/* no login user，on click login popup */}
      {/* user logged in, has not added to fav, onclick popup add to/create collection popup */}
      {/* user logged in,already added to fav,button added fav, onclick remove or change to other collection, or create new collection */}
      {!currentUser && renderOpenModalButton("Favorite", <SignupFormModal />)}
      {isFav &&
        renderOpenModalButton(
          "Added Favorite",
          <FavoriteCollectionModal
            restaurantId={restaurantId}
            setIsFav={setIsFav}
          />
        )}
      {/* current user does not have existing collections */}
      {currentUser &&
        !isFav &&
        !Object.values(currUserFavs).length &&
        // <OpenModalButton
        //   buttonText={
        //     <>
        //       <FontAwesomeIcon
        //         icon="fa-solid fa-heart"
        //         className="display-bone"
        //       />
        //       Favorite
        //     </>
        //   }
        //   modalComponent={
        //     <NewFavoriteCollectionForm
        //       restaurantId={restaurantId}
        //       setIsFav={setIsFav}
        //     />

        //     )
        //   }
        // />
        renderOpenModalButton(
          "Favorite",
          <NewFavoriteCollectionForm
            restaurantId={restaurantId}
            setIsFav={setIsFav}
          />
        )}
      {/* current user has existing collections */}
      {currentUser && !isFav && Object.values(currUserFavs).length > 0 && (
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
          modalComponent={
            <FavoriteCollectionModal
              restaurantId={restaurantId}
              setIsFav={setIsFav}
            />
          }
        />
      )}
      {/* image feature */}
      {!currentUser && renderOpenModalButton("Add photo", <SignupFormModal />)}
      {currentUser &&
        renderOpenModalButton(
          "Add photo",
          <NewImageModal restaurantId={restaurantId} />
        )}
    </div>
  );
};
export default FunctionBtns;
