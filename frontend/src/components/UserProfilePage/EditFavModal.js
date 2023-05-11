import { useModal } from "../../context/Modal";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateFav } from "../../store/favorites";
import { useDispatch } from "react-redux";
const EditFavModal = ({ fav }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const {
    title: initialTitle,
    description: initialDescription,
    isPublic: initialPublic,
  } = fav;

  const [collectionTitle, setCollectionTitle] = useState(initialTitle);
  const [collectionDescription, setCollectionDescription] =
    useState(initialDescription);
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [isDisable, setIsDisable] = useState(true);
  console.log(isPublic);
  useEffect(() => {
    if (collectionTitle && collectionDescription) setIsDisable(false);
    else setIsDisable(true);
  }, [collectionDescription, collectionTitle]);
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    console.log(isPublic, "27");
    await dispatch(
      updateFav({
        title: collectionTitle,
        description: collectionDescription,
        is_public: isPublic,
        favId: fav.id,
      })
    );
    closeModal();
  };
  console.log(fav.id, "38", collectionDescription, collectionTitle, isPublic);
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
        <form onSubmit={handleUpdateSubmit}>
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
            ></input>
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
            ></input>
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
              Update
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

export default EditFavModal;
