import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  filterRestaurantByPrice,
  filterRestaurantByRating,
  getAllRestaurants,
} from "../../store/restaurants";

import FilterTabs from "./FilterTabs";
import Map from "./Map";
import RestaurantCard from "./RestaurantCard/RestaurantCard";
import PageNumbers from "./PageNumbers";
import "./AllRestaurantsPage.css";
import LoadingSpinner from "../LoadingSpinner";
const AllRestaurantsPage = () => {
  const dispatch = useDispatch();
  // const allRestaurants = useSelector((state) => state.restaurants.restaurants);
  const allRestaurants = useSelector(
    (state) => state.restaurants.displayRestaurants
  );
  const loadingRestaurants = useSelector(
    (state) => state.restaurants.isLoading
  );
  const totalResults = useSelector(
    (state) => state.restaurants.totalRestaurants
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState();
  const [selectedPrice, setSelectedPrice] = useState();
  const [pageNumber, setPageNumber] = useState(24);
  // const pageNumber = Math.ceil(totalResults / 20); //max 480/20=24
  const totalPages = (pages) => Math.ceil(pages / 20);
  useEffect(() => {
    // fetch initial page

    if (!selectedPrice && !selectedRating) {
      dispatch(getAllRestaurants({ page: 1 }));
      setPageNumber(24);
    }
    if (selectedRating) {
      dispatch(filterRestaurantByRating(selectedRating));
    }
    if (selectedPrice) {
      dispatch(filterRestaurantByPrice(selectedPrice));
    }
  }, [dispatch, selectedPrice, selectedRating, totalResults]);
  useEffect(() => {
    if (selectedRating) {
      setPageNumber(totalPages(Object.values(allRestaurants).length));
    }
  }, [dispatch, selectedRating, allRestaurants]);

  useEffect(() => {
    if (selectedPrice) {
      setPageNumber(totalPages(Object.values(allRestaurants).length));
    }
  }, [dispatch, selectedPrice, allRestaurants]);
  // fetch page with offset page
  const handlePageChange = async (pageNum) => {
    setCurrentPage(pageNum);
    await dispatch(getAllRestaurants({ page: pageNum }));
    if (selectedRating) {
      setCurrentPage(1);
      await dispatch(getAllRestaurants(1));
      dispatch(filterRestaurantByRating(selectedRating));
    }
    if (selectedPrice) {
      setCurrentPage(1);
      await dispatch(getAllRestaurants(1));
      dispatch(filterRestaurantByPrice(selectedPrice));
    }
  };
  const displayRestaurantIdx = (idx) => {
    return idx + 1 + (currentPage - 1) * 20;
  };
  if (!allRestaurants || loadingRestaurants) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="allRestaurants-left-section">
        <FilterTabs
          setSelectedRating={setSelectedRating}
          selectedRating={selectedRating}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
        />
        <div className="restaurant-cards-container">
          {Object.values(allRestaurants).length ? (
            Object.values(allRestaurants).map((restaurant, idx) => (
              <RestaurantCard
                key={idx}
                restaurant={restaurant}
                idx={displayRestaurantIdx(idx)}
              />
            ))
          ) : (
            <div>
              <h3>Sorry,we couldn't find any results</h3>
              <p>Try clearing filters to see more results</p>
            </div>
          )}
        </div>
        {pageNumber > 0 && (
          <PageNumbers
            pageNumber={pageNumber}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        )}
      </div>
      <div className="allRestaurants-right-section">
        <Map />
      </div>
    </div>
  );
};

export default AllRestaurantsPage;
