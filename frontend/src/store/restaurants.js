import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: {
    currentPage: 1,
    restaurants: {}, //byId
    error: null,
    isLoading: false,
    displayRestaurants: {},
    filteredRestaurants: null,
    searchResults: null,
    searchRecommend: [],
    searchLocation: [],
    totalPages: 0,
  },

  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
      const allRestaurants = Object.values(
        state.filteredRestaurants
          ? state.filteredRestaurants
          : state.restaurants
      );
      const restaurantToDisplay = allRestaurants.slice(
        (state.currentPage - 1) * 20,
        (state.currentPage - 1) * 20 + 20
      );

      state.displayRestaurants = restaurantToDisplay.reduce((accu, curr) => {
        return { ...accu, [curr.id]: curr };
      }, {});
    },
    filterRestaurantByRating(state, action) {
      const rating = action.payload;
      const allRestaurants = state.filteredRestaurants
        ? state.filteredRestaurants
        : state.restaurants;
      state.filteredRestaurants = Object.values(allRestaurants).filter(
        (restaurant) => restaurant.avgRating >= rating
      );

      state.totalPages = Math.ceil(
        Object.keys(state.filteredRestaurants).length / 20
      );
    },
    filterRestaurantByPrice(state, action) {
      const price = action.payload;
      const allRestaurants = state.filteredRestaurants
        ? state.filteredRestaurants
        : state.restaurants;
      state.filteredRestaurants = Object.values(allRestaurants).filter(
        (restaurant) => restaurant.price === price
      );

      state.totalPages = Math.ceil(
        Object.keys(state.filteredRestaurants).length / 20
      );
    },
    searchRestaurants(state, action) {
      const keyword = action.payload.keyword.toLowerCase();
      // const location = action.payload.location.toLowerCase();
      const allRestaurants = state.restaurants;

      const newRecommendations = [];
      // const locations = [];

      Object.values(allRestaurants).forEach((restaurant) => {
        if (restaurant.categories.length > 0)
          restaurant.categories.forEach((category) => {
            if (category.title.toLowerCase().startsWith(keyword)) {
              newRecommendations.push(category.title);
            }
          });
      });
      Object.values(allRestaurants).forEach((restaurant) => {
        if (restaurant.name.toLowerCase().startsWith(keyword)) {
          newRecommendations.push(restaurant.name);
        }
      });
      // Object.values(allRestaurants).forEach((restaurant) => {
      //   if (
      //     restaurant.address &&
      //     restaurant.address.toLowerCase().includes(location)
      //   ) {
      //     locations.push(restaurant.address);
      //   }
      // });
      // make the array unique
      state.searchRecommend = [...new Set(newRecommendations)];
      // state.searchLocation = [...new Set(locations)];

      if (!keyword) state.searchRecommend = [];
      state.searchResults = Object.values(allRestaurants)
        .filter(
          (restaurant) =>
            !keyword ||
            (restaurant.categories.length > 0 &&
              restaurant.categories.some((category) =>
                category.title.toLowerCase().startsWith(keyword)
              )) ||
            restaurant.name.toLowerCase().startsWith(keyword)
          //  &&
          // (!location ||
          //   (restaurant.address &&
          //     restaurant.address.toLowerCase().includes(location)) ||
          //   restaurant.zipcode.toString() === location)
        )
        .reduce((obj, restaurant) => {
          obj[restaurant.id] = restaurant;
          return obj;
        }, {});
    },

    submitSearch(state) {
      state.filteredRestaurants = state.searchResults;
      state.totalPages = Math.ceil(
        Object.keys(state.filteredRestaurants).length / 20
      );
    },
    clearFilter(state) {
      state.filteredRestaurants = Object.keys(state.searchResults).length
        ? state.searchResults
        : null;
      state.totalPages = Math.ceil(
        Object.keys(
          Object.keys(state.searchResults).length
            ? state.searchResults
            : state.restaurants
        ).length / 20
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllRestaurants.fulfilled, (state, action) => {
        // restaurants array
        let { restaurants } = action.payload;
        let res = {};
        let displayed = {};
        restaurants.forEach((restaurant, idx) => {
          res[restaurant.id] = restaurant;
          // set initial displayed restaurants
          if (idx < 20) displayed[restaurant.id] = restaurant;
        });
        state.restaurants = res;
        state.displayRestaurants = displayed;
        state.isLoading = false;
      })
      .addCase(getAllRestaurants.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getAllRestaurants.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getRestaurantById.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getRestaurantById.fulfilled, (state, action) => {
        state.restaurants[action.payload.id] = action.payload;
        state.displayRestaurants[action.payload.id] = action.payload;
        state.isLoading = false;
      })
      .addCase(getRestaurantById.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});
export const getAllRestaurants = createAsyncThunk(
  "restaurants/getAllRestaurants",
  async (_, { rejectWithValue }) => {
    const allRestaurants = [];

    const response = await fetch(`/api/restaurants/`);
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    allRestaurants.push(...data.restaurants);

    return { restaurants: allRestaurants };
  }
);

export const getRestaurantById = createAsyncThunk(
  "restaurants/getRestaurantById",
  async (restaurantId, { rejectWithValue }) => {
    const response = await fetch(`/api/restaurants/${restaurantId}`);
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data);
    return data;
  }
);
export const {
  sortRestaurantByHighestRating,
  sortRestaurantByMostReviews,
  filterRestaurantByPrice,
  filterRestaurantByRating,
  setCurrentPage,
  clearFilter,
  searchRestaurants,
  submitSearch,
} = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
