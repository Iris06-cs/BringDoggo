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
import LoadingSpinner from "../LoadingSpinner";
import {
  getAllFavs,
  getCurrentUserFavs,
  selectCurrUserFavs,
} from "../../store/favorites";

const RestaurantDetailPage = () => {
  const dispatch = useDispatch();
  const { restaurantId } = useParams();
  // const currentUser = useSelector((state) => state.session.user);
  // const allRestaurants = useSelector((state) => state.restaurants.restaurants);
  // const isLoading = useSelector((state) => state.restaurants.isLoading);
  const { currentUser, allRestaurants, isLoading, currUserFavs } = useSelector(
    (state) => ({
      currentUser: state.session.user,
      allRestaurants: state.restaurants.restaurants,
      isLoading: state.restaurants.isLoading,
      currUserFavs: selectCurrUserFavs(state),
    })
  );
  const [currentUserReview, setCurrentUserReview] = useState();
  const [hasReview, setHasReview] = useState(false);
  const [restaurantDetail, setRestaurantDetail] = useState();
  const [isFetched, setIsFetched] = useState(false);
  const [isFav, setIsFav] = useState(false);
  useEffect(() => {
    if (!restaurantId) return;
    const fetchRestaurant = async () => {
      await dispatch(getRestaurantById(restaurantId));
      await dispatch(getAllFavs());
      setIsFetched(true);
    };
    fetchRestaurant();

    if (currentUser) {
      dispatch(getCurrentUserFavs());
    }
  }, [dispatch, restaurantId, currentUser]);

  useEffect(() => {
    if (isFetched && allRestaurants) {
      setRestaurantDetail(allRestaurants[restaurantId]);
    }
  }, [isFetched, allRestaurants, restaurantId]);

  useEffect(() => {
    if (!restaurantDetail) return;
    if (!currentUser) setHasReview(false);
    else {
      const reviews = restaurantDetail.reviews;
      let userReviewFound = false;
      if (reviews.length) {
        reviews.forEach((review) => {
          if (currentUser && review.authorId === currentUser.id) {
            setCurrentUserReview(review);
            setHasReview(true);
            userReviewFound = true;
          }
        });
      }
      if (!userReviewFound) {
        setHasReview(false);
      }
      if (currUserFavs) {
        const favs = Object.values(currUserFavs);
        favs.forEach((fav) => {
          const restaurants = fav.restaurants; //object
          if (restaurants[restaurantId]) setIsFav(true);
        });
      }
    }
  }, [currentUser, restaurantDetail, currUserFavs, restaurantId]);

  if (isLoading || !restaurantDetail) return <LoadingSpinner />;

  return (
    <div className="page-container detail-page">
      <TopSection restaurantDetail={restaurantDetail} />
      <div className="page-content-container">
        <div className="page-content-left-container">
          <FunctionBtns
            hasReview={hasReview}
            name={restaurantDetail.name}
            currentUserReview={currentUserReview}
            isFav={isFav}
          />
          <ReviewOverview restaurantDetail={restaurantDetail} />
          <FilterSorter />
          <Reviews
            restaurantDetail={restaurantDetail}
            setHasReview={setHasReview}
          />
        </div>
        <ContactLocationCard />
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
