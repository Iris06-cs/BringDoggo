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

const RestaurantDetailPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const { restaurantId } = useParams();
  const allRestaurants = useSelector((state) => state.restaurants.restaurants);

  const [currentUserReview, setCurrentUserReview] = useState();
  const [hasReview, setHasReview] = useState(false);
  const [restaurantDetail, setRestaurantDetail] = useState();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      dispatch(getRestaurantById(restaurantId));
    }
    // dispatch(authenticate());
    setIsFetched(true);
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (isFetched && allRestaurants) {
      setRestaurantDetail(allRestaurants[restaurantId]);
    }
  }, [isFetched, allRestaurants, restaurantId]);
  useEffect(() => {
    if (restaurantDetail) {
      const reviews = restaurantDetail.reviews;
      if (reviews.length) {
        reviews.forEach((review) => {
          if (currentUser && review.id === currentUser.id)
            setCurrentUserReview(review);
          setHasReview(true);
        });
      }
    }
    // reset hasReview
    if (isFetched && !currentUser) setHasReview(false);
  }, [currentUser, restaurantDetail, isFetched]);

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
