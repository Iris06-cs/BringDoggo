import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllRestaurants } from "../../store/restaurants";

import FilterTabs from "./FilterTabs";
import Map from "./Map";
import RestaurantCard from "./RestaurantCard/RestaurantCard";
import PageNumbers from "./PageNumbers";
import "./AllRestaurantsPage.css";
import LoadingSpinner from "../LoadingSpinner";
const AllRestaurantsPage = () => {
  const dispatch = useDispatch();
  const allRestaurants = useSelector((state) => state.restaurants.restaurants);
  const loadingRestaurants = useSelector(
    (state) => state.restaurants.isLoading
  );
  const totalResults = useSelector(
    (state) => state.restaurants.totalRestaurants
  );
  const [currentPage, setCurrentPage] = useState(1);

  const pageNumber = Math.ceil(totalResults / 20); //max 480/20=24

  useEffect(() => {
    // fetch initial page
    dispatch(getAllRestaurants(1));
  }, [dispatch]);
  // fetch page with offset page
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    dispatch(getAllRestaurants(pageNum));
  };
  const displayRestaurantIdx = (idx) => {
    return idx + 1 + (currentPage - 1) * 20;
  };
  if (!allRestaurants || loadingRestaurants) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="allRestaurants-left-section">
        <FilterTabs />
        <div className="restaurant-cards-container">
          {Object.values(allRestaurants).map((restaurant, idx) => (
            <RestaurantCard
              key={idx}
              restaurant={restaurant}
              idx={displayRestaurantIdx(idx)}
            />
          ))}
        </div>
        <PageNumbers
          pageNumber={pageNumber}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      </div>
      <div className="allRestaurants-right-section">
        <Map />
      </div>
    </div>
  );
};

export default AllRestaurantsPage;
