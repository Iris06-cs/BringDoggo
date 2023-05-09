import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useHistory } from "react-router-dom";
import RatingBone from "./RatingBone";
import "./AddReviewPage.css";
import {
  addReview,
  getAllReviews,
  getCurrentUserReviews,
  selectCurrentUserReviews,
  updateReview,
} from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import LoadingSpinner from "../LoadingSpinner";

const AddReviewPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { restaurantId } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const restaurantName = queryParams.get("name");
  const decodedRestaurantName = decodeURIComponent(restaurantName);
  const initialRating = queryParams.get("rating");

  const { currentUser, currentUserReview, isLoading } = useSelector(
    (state) => ({
      currentUser: state.session.user,
      currentUserReview: selectCurrentUserReviews(state),
      isLoading: state.reviews.isLoading,
    })
  );

  const [selectedRating, setSelctedRating] = useState(initialRating);
  const [reviewInput, setReviewInput] = useState("");
  const [reviewId, setReviewId] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [hasFetchedReviews, setHasFetchedReviews] = useState(false);
  const [isExistingReview, setIsExistingReview] = useState(false);
  useEffect(() => {
    const fetchReviews = async () => {
      if (currentUser) {
        await dispatch(getAllReviews());
        await dispatch(getCurrentUserReviews());
        setHasFetchedReviews(true);
      }
    };
    fetchReviews();
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (hasFetchedReviews && !isExistingReview) {
      const reviews = Object.values(currentUserReview);
      // current user review
      if (currentUser && reviews.length > 0) {
        reviews.forEach((review) => {
          if (review.restaurantId === restaurantId) {
            setIsUpdate(true);
            setReviewId(review.id);
            setReviewInput(review.reviewDetail);
          }
        });
      }
    }
  }, [
    currentUserReview,
    restaurantId,
    currentUser,
    hasFetchedReviews,
    isExistingReview,
  ]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // body validation

    if (reviewId !== undefined) {
      const reqBody = {
        stars: selectedRating,
        review_detail: reviewInput,
        reviewId,
      };
      await dispatch(updateReview(reqBody));
    } else {
      const reqBody = {
        stars: selectedRating,
        review_detail: reviewInput,
        restaurantId,
      };
      await dispatch(addReview(reqBody));
    }

    history.push(`/restaurants/${restaurantId}`);
  };
  if (isLoading) return <LoadingSpinner />;
  console.log(reviewInput);
  return (
    <div className="add-review-form-container">
      <h1>{decodedRestaurantName}</h1>
      {isUpdate && <h3 className="update-alter-msg">Update your review</h3>}
      <form onSubmit={handleFormSubmit}>
        <div className="review-input-area-container">
          <RatingBone
            setSelctedRating={setSelctedRating}
            selectedRating={selectedRating}
          />
          <textarea
            className="review-input-area"
            name="review_detail"
            value={reviewInput}
            onChange={(e) => {
              setIsExistingReview(true);
              setReviewInput(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="post-btn-container">
          {currentUser && (
            <button type="submit" className="general-button">
              Post Review
            </button>
          )}
          {/* if no login user render modal button */}
          {!currentUser && (
            <OpenModalButton
              buttonText="Post Review"
              modalComponent={<SignupFormModal />}
            />
          )}
        </div>
      </form>
    </div>
  );
};
export default AddReviewPage;
