import { useDispatch, useSelector } from "react-redux";
import "./FavoriteCollectionModal.css";
import {
  addRestaurantToFav,
  removeRestaurantFromFav,
  selectCurrUserFavs,
} from "../../store/favorites";
import OpenModalButton from "../OpenModalButton";
import NewFavoriteCollectionForm from "../NewFavoriteCollectionForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faHeart,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../../context/Modal";

const FavoriteCollectionModal = ({ restaurantId, setIsFav }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const currUserFavs = Object.values(
    useSelector((state) => selectCurrUserFavs(state))
  );
  const currUser = useSelector((state) => state.session.user);

  const onClickRemove = async (e, favId) => {
    e.preventDefault();
    await dispatch(removeRestaurantFromFav({ favId, restaurantId }));
    if (currUserFavs.length < 1) setIsFav(false);
    // Check if the restaurant is in any other collections
    const isRestaurantInOtherFavs = currUserFavs.some(
      (fav) => fav.id !== favId && fav.restaurants[restaurantId]
    );
    setIsFav(isRestaurantInOtherFavs);
  };
  const onClickSave = async (e, favId) => {
    e.preventDefault();
    await dispatch(addRestaurantToFav({ favId, restaurantId }));
    // setIsFav(true);
    // Check if the restaurant is in any collections
    const isRestaurantInAnyFav = currUserFavs.some(
      (fav) => fav.restaurants[restaurantId]
    );
    setIsFav(isRestaurantInAnyFav);
  };
  return (
    <div className="modal-content-container favorite">
      <div className="fav-collection-container">
        <div className="title-section-container">
          <h2>Add to Favorite collection</h2>
          <button
            onClick={closeModal}
            className="add-fav-form-close-modal-button"
          >
            <FontAwesomeIcon
              icon={faSquareXmark}
              className="add-fav-form-close-btn"
            />
          </button>
        </div>
        {currUserFavs.length && (
          <ul className="fav-cards-container">
            {currUserFavs.map((fav, idx) => (
              <li className="collection-card-container" key={idx}>
                <div className="fav-info-container">
                  <h3>{fav.title}</h3>
                  <p>
                    By{" "}
                    <span>
                      {currUser.firstname} {currUser.lastname[0]}.
                    </span>
                  </p>
                  <p>{Object.keys(fav.restaurants).length} restaurants</p>
                </div>
                {fav.restaurants[restaurantId] ? (
                  <div className="remove-btn-contaner">
                    <FontAwesomeIcon icon={faCheck} />
                    <p>Added</p>
                    <button
                      onClick={(e) => onClickRemove(e, fav.id)}
                      className="remove-from-fav-btn"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => onClickSave(e, fav.id)}
                    className="general-button save-to-fav-btn"
                  >
                    Save
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <OpenModalButton
          buttonText={
            <>
              <FontAwesomeIcon icon={faHeart} className="display-bone" />
              Add to New Favorite Collection
            </>
          }
          // onItemClick={closeMenu}
          modalComponent={
            <NewFavoriteCollectionForm
              restaurantId={restaurantId}
              setIsFav={setIsFav}
            />
          }
        />
      </div>
    </div>
  );
};
export default FavoriteCollectionModal;
