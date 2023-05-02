import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getRestaurantById } from "../../store/restaurants";
import TopSection from "./TopSection";
import "./RestaurantDetailPage.css";
import FunctionBtns from "./FunctionBtns";
import ContactLocationCard from "./ContactLocationCard";
import ReviewOverview from "./ReviewOverview";
import Reviews from "../Reviews";
const RestaurantDetailPage = () => {
  const dispatch = useDispatch();
  const { restaurantId } = useParams();
  const allRestaurants = useSelector((state) => state.restaurants.restaurants);
  const [restaurantDetail, setRestaurantDetail] = useState();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (restaurantId) dispatch(getRestaurantById(restaurantId));
    setIsFetched(true);
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (isFetched && allRestaurants)
      setRestaurantDetail(allRestaurants[restaurantId]);
  }, [isFetched, allRestaurants, restaurantId]);

  if (!restaurantDetail) return <h1>Loading...</h1>;

  return (
    <div className="page-container detail-page">
      <TopSection restaurantDetail={restaurantDetail} />
      <div className="page-content-container">
        <div className="page-content-left-container">
          <FunctionBtns />
          <ReviewOverview />
          <Reviews />
        </div>
        <ContactLocationCard />
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
