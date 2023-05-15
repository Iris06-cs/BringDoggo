import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  filterRestaurantByPrice,
  filterRestaurantByRating,
  getAllRestaurants,
  getFirstPage,
  setCurrentPage,
} from "../../store/restaurants";

import FilterTabs from "./FilterTabs";
import Map from "./Map";
import RestaurantCard from "./RestaurantCard/RestaurantCard";
import PageNumbers from "./PageNumbers";
import "./AllRestaurantsPage.css";
import LoadingSpinner from "../LoadingSpinner";
const AllRestaurantsPage = () => {
  const dispatch = useDispatch();
  const allRestaurants = useSelector((state) => state.restaurants.restaurants);
  const displayedRestaurants = useSelector(
    (state) => state.restaurants.displayRestaurants
  );
  const loadingRestaurants = useSelector(
    (state) => state.restaurants.isLoading
  );
  const totalResults = useSelector(
    (state) => state.restaurants.totalRestaurants
  );
  const initialPageRestaurents = useSelector(
    (state) => state.restaurants.firstPage
  );
  const restaurantsByPage = useSelector(
    (state) => state.restaurants.restaurantsByPage
  );
  const currentPage = useSelector((state) => state.restaurants.currentPage);
  // const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState();
  const [selectedPrice, setSelectedPrice] = useState();
  const [pageNumber, setPageNumber] = useState(24);
  // const pageNumber = Math.ceil(totalResults / 20); //max 480/20=24
  const totalPages = (pages) => Math.ceil(pages / 20);
  useEffect(() => {
    // fetch initial page
    dispatch(getFirstPage()).then((response) => {
      if (response.type === getFirstPage.fulfilled.type) {
        dispatch(setCurrentPage(1));
      }
    });
    dispatch(getAllRestaurants());
    setPageNumber(24);

    // if (selectedRating) {
    //   dispatch(filterRestaurantByRating(selectedRating));
    // }
    // if (selectedPrice) {
    //   dispatch(filterRestaurantByPrice(selectedPrice));
    // }
  }, [dispatch]);
  // useEffect(() => {
  //   if (selectedRating) {
  //     setPageNumber(totalPages(Object.values(displayedRestaurants).length));
  //   }
  // }, [dispatch, selectedRating, displayedRestaurants]);

  // useEffect(() => {
  //   if (selectedPrice) {
  //     setPageNumber(totalPages(Object.values(displayedRestaurants).length));
  //   }
  // }, [dispatch, selectedPrice, displayedRestaurants]);
  // fetch page with offset page
  const handlePageChange = (pageNum) => {
    dispatch(setCurrentPage(pageNum));
  };
  const displayRestaurantIdx = (idx) => {
    return idx + 1 + (currentPage - 1) * 20;
  };
  if (loadingRestaurants) return <LoadingSpinner />;
  if (currentPage > 1 && Object.values(allRestaurants).length < 480)
    return <LoadingSpinner />;
  console.log(currentPage);
  return (
    <div className="page-container">
      <div className="allRestaurants-left-section">
        {/* <FilterTabs
          setSelectedRating={setSelectedRating}
          selectedRating={selectedRating}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
        /> */}
        <div className="restaurant-cards-container">
          {
            Object.values(displayedRestaurants).length > 0 ? (
              Object.values(displayedRestaurants).map((restaurant, idx) => (
                <RestaurantCard
                  key={idx}
                  restaurant={restaurant}
                  idx={displayRestaurantIdx(idx)}
                />
              ))
            ) : (
              <LoadingSpinner />
            )
            // <div>
            //   <h3>Sorry,we couldn't find any results</h3>
            //   <p>Try clearing filters to see more results</p>
            // </div>
          }
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
