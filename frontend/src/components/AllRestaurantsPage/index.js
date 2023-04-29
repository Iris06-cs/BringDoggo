import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllRestaurants } from "../../store/restaurants";

import FilterTabs from "./FilterTabs";
import Map from "./Map";
import RestaurantCard from "./RestaurantCard";
import PageNumbers from "./PageNumbers";

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
  const [startNum, setStartNum] = useState(1);
  const pageNumber = Math.ceil(totalResults / 20); //max 480/20=24

  useEffect(() => {
    dispatch(getAllRestaurants(1));
  }, [dispatch]);
  console.log(currentPage);
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    dispatch(getAllRestaurants(pageNum));
  };
  const displayRestaurantIdx = (idx) => {
    return idx + 1 + (currentPage - 1) * 20;
  };
  if (!allRestaurants || loadingRestaurants) return <h1>Loading...</h1>;

  return (
    <div>
      <FilterTabs />
      {Object.values(allRestaurants).map((restaurant, idx) => (
        <RestaurantCard
          key={idx}
          restaurant={restaurant}
          idx={displayRestaurantIdx(idx)}
        />
      ))}
      <PageNumbers
        pageNumber={pageNumber}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        startNum={startNum}
        setStartNum={setStartNum}
      />
      <Map />
    </div>
  );
};

export default AllRestaurantsPage;
