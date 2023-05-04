import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getRestaurantById } from "../../store/restaurants";
import TopSection from "./TopSection";
import "./RestaurantDetailPage.css";
import FunctionBtns from "./FunctionBtns";
import ContactLocationCard from "./ContactLocationCard";
import ReviewOverview from "./ReviewOverview";
import Reviews from "./Reviews";
import FilterSorter from "./FilterSorter";
import { authenticate } from "../../store/session";
import { getReviewsByRestaurantId } from "../../store/reviews";
const RestaurantDetailPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const { restaurantId } = useParams();
  const allRestaurants = useSelector((state) => state.restaurants.restaurants);
  const reviews = useSelector((state) => state.reviews.reviewsById);
  const restaurantReviewIds = useSelector(
    (state) => state.reviews.reviewIdsByRestaurantId
  );
  const [currentUserReview, setCurrentUserReview] = useState();
  const [hasReview, setHasReview] = useState(false);
  const [restaurantDetail, setRestaurantDetail] = useState();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      dispatch(getRestaurantById(restaurantId));
      dispatch(getReviewsByRestaurantId(restaurantId));
    }
    dispatch(authenticate());
    setIsFetched(true);
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (isFetched && allRestaurants) {
      setRestaurantDetail(allRestaurants[restaurantId]);

      if (reviews && restaurantReviewIds[restaurantId]) {
        const reviewIds = restaurantReviewIds[restaurantId];

        reviewIds.forEach((id) => {
          // check whether current user has review for the restaurant
          console.log(reviews[id]);
          const review = reviews[id];
          if (review && currentUser && review.authorId === currentUser.id)
            setCurrentUserReview(reviews[id]);
          setHasReview(true);
        });
      }
    }
    // reset hasReview
    if (isFetched && !currentUser) setHasReview(false);
  }, [
    isFetched,
    allRestaurants,
    restaurantId,
    reviews,
    currentUser,
    restaurantReviewIds,
  ]);

  if (!restaurantDetail) return <h1>Loading...</h1>;

  return (
    <div className="page-container detail-page">
      <TopSection restaurantDetail={restaurantDetail} />
      <div className="page-content-container">
        <div className="page-content-left-container">
          <FunctionBtns hasReview={hasReview} />
          <ReviewOverview restaurantDetail={restaurantDetail} />
          <FilterSorter />
          <Reviews restaurantDetail={restaurantDetail} />
        </div>
        <ContactLocationCard />
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
