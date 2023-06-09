import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";
import { useHistory } from "react-router-dom";
import { addRestaurantImage } from "../../store/restaurantImage";
import { useModal } from "../../context/Modal";
import { getAllRestaurants } from "../../store/restaurants";

const NewImageModal = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const restaurants = useSelector((state) => state.restaurants.restaurants);
  const currUser = useSelector((state) => state.session.user);
  const [currRestaurant, setCurrRestaurant] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [validations, setValidations] = useState([]);
  // const [isSubmited, setIsSubmited] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const { closeModal } = useModal();
  useEffect(() => {
    if (restaurants) {
      setCurrRestaurant(restaurants[restaurantId]);
      setIsLoaded(true);
    }
  }, [restaurantId, restaurants]);
  useEffect(() => {
    const errs = [];
    const trimmedCaption = caption.trim(); //remove white space

    if (
      (trimmedCaption.length === 0 && caption.length > 0) ||
      trimmedCaption.length > 255
    ) {
      errs.push("Please enter a valid caption.");
    }

    setValidations(errs);
    if (!image || !caption.length) setIsDisabled(true);
    else setIsDisabled(false);
  }, [caption, image]);

  const handleFomrSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("caption", caption);
    formData.append("preview", isPreview);
    formData.append("image", image);
    formData.append("user_id", currUser.id);
    formData.append("restaurant_id", restaurantId);

    setImageLoading(true);
    // setIsSubmited(true);
    await dispatch(addRestaurantImage(formData));
    // get updated restaurants
    await dispatch(getAllRestaurants());
    setImageLoading(false);
    setCaption("");
    setImage("");
    setImageLoading(false);
    // setIsSubmited(false);
    closeModal();
    history.push(`/restaurants/${restaurantId}`);
  };
  if (!isLoaded || imageLoading)
    return (
      <div className="add-img-modal-container loading">
        <LoadingSpinner />
      </div>
    );
  return (
    <div className="add-img-modal-container">
      <h2>
        {currRestaurant.name}:<span>Add Photos</span>
      </h2>
      <form
        onSubmit={handleFomrSubmit}
        encType="multipart/form-data"
        className="add-img-form"
      >
        <div className="caption-container">
          <label htmlFor="restaurant-img-caption">Caption</label>
          <input
            id="restaurant-img-caption"
            type="text"
            name="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="restaurant-image">Add Photo</label>
          <input
            id="restaurant-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className="radio-btn-container">
          <input
            id="is-preview-option"
            type="radio"
            value="true"
            name="is_preview"
            checked={isPreview === true}
            onChange={(e) => setIsPreview(e.target.value === "true")}
          />
          <label htmlFor="is-preview-option">Preview</label>
          <input
            id="isNot-preview-option"
            type="radio"
            value="false"
            name="is_preview"
            checked={isPreview === false}
            onChange={(e) => setIsPreview(e.target.value === "true")}
          />
          <label htmlFor="isNot-preview-option">Non-Preview</label>
        </div>
        <ul>
          {validations.length > 0 &&
            validations.map((err) => <li key={err}>{err}</li>)}
        </ul>
        <button
          className={"general-button" + (isDisabled ? " disabled" : "")}
          type="submit"
          disabled={isDisabled}
        >
          Upload Photo
        </button>
      </form>
    </div>
  );
};
export default NewImageModal;
