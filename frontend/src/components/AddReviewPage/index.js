import { useLocation } from "react-router-dom";
import RatingTooltip from "../RestaurantDetailPage/Reviews/RatingTooltip";
import "./AddReviewPage.css";

const AddReviewPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // need restaurant name,rating
  const name = queryParams.get("name");
  const rating = queryParams.get("rating");
  const decodedRestaurantName = decodeURIComponent(name);

  return (
    <div className="add-review-form-container">
      <h1>{decodedRestaurantName}</h1>
      <form>
        <div className="review-input-area-container">
          <RatingTooltip />
          <textarea
            className="review-input-area"
            name="review_detail"
          ></textarea>
        </div>
        <div className="post-btn-container">
          <button type="submit" className="general-button">
            Post Review
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddReviewPage;
