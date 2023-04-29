import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllRestaurants } from "../../store/restaurants";

import FilterTabs from "./FilterTabs";
import Map from "./Map";
import RestaurantCard from "./RestaurantCard";

const AllRestaurantsPage = () => {
  const dispatch = useDispatch();
  const allRestaurants = useSelector((state) => state.restaurants.restaurants);

  useEffect(() => {
    dispatch(getAllRestaurants());
  }, [dispatch]);
  if (!allRestaurants) return <h1>Loading...</h1>;
  return (
    <div>
      <FilterTabs />
      {Object.values(allRestaurants).map((restaurant, idx) => (
        <RestaurantCard key={idx} restaurant={restaurant} idx={idx + 1} />
      ))}
      <Map />
    </div>
  );
};

export default AllRestaurantsPage;
