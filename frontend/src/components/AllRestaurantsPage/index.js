import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentPage,
  filterRestaurantByPrice,
  filterRestaurantByRating,
  clearFilter,
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
  const filteredRestaurants = useSelector((state) => state.filteredRestaurants);
  const displayedRestaurants = useSelector(
    (state) => state.restaurants.displayRestaurants
  );
  const loadingRestaurants = useSelector(
    (state) => state.restaurants.isLoading
  );

  const currentPage = useSelector((state) => state.restaurants.currentPage);
  const pageNumber = useSelector((state) => state.restaurants.totalPages);
  const [selectedRating, setSelectedRating] = useState();
  const [selectedPrice, setSelectedPrice] = useState();
  const [orderedRestaurantIds, setOrderedRestaurantIds] = useState([]);
  const [currentHover, setCurrentHover] = useState(null);
  const [sortBy, setSortBy] = useState("");
  useEffect(() => {
    // fetch initial page
    if (!loadingRestaurants) dispatch(setCurrentPage(1));
  }, [dispatch, loadingRestaurants]);

  useEffect(() => {
    let ids = Object.keys(allRestaurants);
    if (sortBy === "highestRating") {
      ids.sort(
        (b, a) => allRestaurants[a].avgRating - allRestaurants[b].avgRating
      );
    } else if (sortBy === "mostRated") {
      ids.sort(
        (b, a) =>
          allRestaurants[a].dogReviewCount - allRestaurants[b].dogReviewCount
      );
    }
    setOrderedRestaurantIds(ids);
  }, [allRestaurants, sortBy]);

  useEffect(() => {
    if (!selectedPrice && !selectedRating) {
      dispatch(clearFilter());
      dispatch(setCurrentPage(1));
    }
    if (selectedPrice) {
      dispatch(filterRestaurantByPrice(selectedPrice));
      dispatch(setCurrentPage(1));
    }
    if (selectedRating) {
      dispatch(filterRestaurantByRating(selectedRating));
      dispatch(setCurrentPage(1));
    }
  }, [selectedPrice, selectedRating, dispatch, allRestaurants]);

  // fetch page with offset page
  const handlePageChange = (pageNum) => {
    dispatch(setCurrentPage(pageNum));
  };
  const displayRestaurantIdx = (idx) => {
    return idx + 1 + (currentPage - 1) * 20;
  };
  if (loadingRestaurants || orderedRestaurantIds.length < 1)
    return <LoadingSpinner />;

  // if (!Object.values(allRestaurants).length) return <LoadingSpinner />;

  return (
    <div className="page-container">
      <div className="page-main-content-container">
        <div className="allRestaurants-left-section">
          <FilterTabs
            setSelectedRating={setSelectedRating}
            selectedRating={selectedRating}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <div className="restaurant-cards-container">
            {pageNumber > 0 ? (
              orderedRestaurantIds
                .map((id) => displayedRestaurants[id])
                .filter((restaurant) => restaurant)
                .map((restaurant, idx) => (
                  <RestaurantCard
                    key={idx}
                    restaurant={restaurant}
                    idx={displayRestaurantIdx(idx)}
                    currentHover={currentHover}
                    setCurrentHover={setCurrentHover}
                  />
                ))
            ) : (
              <div>
                <h3>No Results Found</h3>
                <p>
                  Please try to modify or clear your filter setting to see more
                  results.
                </p>
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
          <Map
            currentPage={currentPage}
            currentHover={currentHover}
            setCurrentHover={setCurrentHover}
          />
        </div>
      </div>
    </div>
  );
};

export default AllRestaurantsPage;
