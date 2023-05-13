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

  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [reviewInput, setReviewInput] = useState("");
  const [currRating, setCurrRating] = useState();
  const [reviewId, setReviewId] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [hasFetchedReviews, setHasFetchedReviews] = useState(false);
  const [isExistingReview, setIsExistingReview] = useState(false);
  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);
  useEffect(() => {
    const fetchReviews = async () => {
      if (currentUser) {
        const userReviews = await dispatch(getCurrentUserReviews());
        // setHasFetchedReviews(true);
        const reviews = userReviews.payload;

        if (reviews.length > 0) {
          reviews.forEach((review) => {
            if (review.restaurantId === restaurantId) {
              setIsUpdate(true);
              setReviewId(review.id);
              setReviewInput(review.reviewDetail);
              setCurrRating(review.stars);
            }
          });
        }
      }
    };
    fetchReviews();
  }, [dispatch, currentUser, restaurantId]);

  // useEffect(() => {
  //   if (hasFetchedReviews && !isExistingReview) {
  //     const reviews = Object.values(currentUserReview);
  //     // current user review
  //     if (reviews.length > 0) {
  //       reviews.forEach((review) => {
  //         if (review.restaurantId === restaurantId) {
  //           setIsUpdate(true);
  //           setReviewId(review.id);
  //           console.log("64");
  //           setReviewInput(review.reviewDetail);
  //         }
  //       });
  //     }
  //   }
  // }, [
  //   currentUserReview,
  //   restaurantId,
  //   currentUser,
  //   hasFetchedReviews,
  //   isExistingReview,
  // ]);
  useEffect(() => {
    if (selectedRating && reviewInput) setIsDisable(false);
    else setIsDisable(true);
  }, [selectedRating, reviewInput]);
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
  console.log(reviewInput, isUpdate);
  return (
    <div className="add-review-form-container">
      <h1>{decodedRestaurantName}</h1>
      <form onSubmit={handleFormSubmit}>
        {isUpdate && <h3 className="update-alter-msg">Update your review</h3>}
        <div className="review-input-area-container">
          <RatingBone
            setSelectedRating={setSelectedRating}
            selectedRating={selectedRating}
            currRating={currRating}
            setCurrRating={setCurrRating}
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
            <button
              type="submit"
              className={"general-button" + (isDisable ? " disabled" : "")}
              disabled={isDisable}
            >
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
