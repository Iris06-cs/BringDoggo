import { useDispatch, useSelector } from "react-redux";
import "./FavoriteCollectionModal.css";
import { addFav, selectCurrUserFavs } from "../../store/favorites";
import OpenModalButton from "../OpenModalButton";
import NewFavoriteCollectionForm from "../NewFavoriteCollectionForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FavoriteCollectionModal = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const currUserFavs = Object.values(
    useSelector((state) => selectCurrUserFavs(state))
  );
  const currUser = useSelector((state) => state.session.user);
  console.log(currUserFavs);
  console.log(restaurantId);
  return (
    <div className="modal-content-container favorite">
      <div className="fav-collection-container">
        <h2>Add to Favorite collection</h2>
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
                    <FontAwesomeIcon icon="fa-solid fa-check" />
                    <p>Added</p>
                    <button className="remove-from-fav-btn">Remove</button>
                  </div>
                ) : (
                  <button className="general-button save-to-fav-btn">
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
              <FontAwesomeIcon
                icon="fa-solid fa-heart"
                className="display-bone"
              />
              Add to New Favorite Collection
            </>
          }
          // onItemClick={closeMenu}
          modalComponent={<NewFavoriteCollectionForm />}
        />
      </div>
    </div>
  );
};
export default FavoriteCollectionModal;
