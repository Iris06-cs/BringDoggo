import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import "./NewFavoriteCollectionForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { addRestaurantToFav, createFav } from "../../store/favorites";
const NewFavoriteCollectionForm = ({ restaurantId, setIsFav }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [collectionTitle, setCollectionTitle] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true); //default to true
  const [isDisable, setIsDisable] = useState(true);
  const [favId, setFavId] = useState();
  // input validation
  useEffect(() => {
    if (collectionTitle && collectionDescription) setIsDisable(false);
    else setIsDisable(true);
  }, [collectionDescription, collectionTitle]);
  const submitForm = async (e) => {
    e.preventDefault();

    const newFav = await dispatch(
      createFav({
        title: collectionTitle,
        description: collectionDescription,
        is_public: isPublic,
      })
    );
    setFavId(newFav.payload.id);
    setIsFav(true);
    closeModal();
  };
  useEffect(() => {
    dispatch(addRestaurantToFav({ favId, restaurantId }));
  }, [favId, restaurantId, dispatch]);

  return (
    <div className="modal-content-container fav-form">
      <div className="new-fav-collection-container">
        <div className="fav-title-section-container">
          <h2>New Favorite Collection</h2>
          <button
            onClick={closeModal}
            className="add-fav-form-close-modal-button"
          >
            <FontAwesomeIcon
              icon="fa-solid fa-square-xmark"
              className="add-fav-form-close-btn"
            />
          </button>
        </div>
        <form onSubmit={submitForm}>
          <div className="new-fav-title-container">
            <label
              htmlFor="fav-collection-title"
              id="fav-collection-title-label"
            >
              Collection Name
            </label>
            <input
              id="fav-collection-title"
              name="title"
              type="text"
              value={collectionTitle}
              onChange={(e) => setCollectionTitle(e.target.value)}
              placeholder="Best Sushi Bars,Favorite Cafes..."
              required
            />
          </div>
          <div className="new-fav-description-container">
            <label
              htmlFor="fav-collection-description"
              id="fav-collection-description-label"
            >
              Collection Description
            </label>
            <input
              id="fav-collection-description"
              name="description"
              type="text"
              value={collectionDescription}
              onChange={(e) => setCollectionDescription(e.target.value)}
              placeholder="Sushi places at North City..."
              required
            />
          </div>
          <div className="radio-btn-container">
            <input
              id="is-public-option"
              type="radio"
              value="true"
              name="is_public"
              checked={isPublic === true}
              onChange={(e) => setIsPublic(e.target.value === "true")}
            />
            <label htmlFor="is-public-option">Public</label>
            <input
              id="isNot-public-option"
              type="radio"
              value="false"
              name="is_public"
              checked={isPublic === false}
              onChange={(e) => setIsPublic(e.target.value === "true")}
            />
            <label htmlFor="isNot-public-option">Non-Public</label>
          </div>
          <p>A public Collection can be openly featured on BringDoggo.</p>
          <div className="fav-collection-btns-container">
            <button
              className={"general-button" + (isDisable ? " disabled" : "")}
              type="submit"
              disabled={isDisable}
            >
              Save
            </button>
            <button onClick={closeModal} className="general-button">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NewFavoriteCollectionForm;
