import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: {
    currentPage: 1,
    restaurants: {}, //byId
    error: null,
    isLoading: false,
    totalRestaurants: null,
    displayRestaurants: {},
  },

  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
      const allRestaurants = Object.values(state.restaurants);
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
      const allRestaurants = state.restaurants;
      state.displayRestaurants = Object.fromEntries(
        Object.entries(allRestaurants).filter(
          ([_, restaurant]) => restaurant.avgRating >= rating
        )
      );
    },
    filterRestaurantByPrice(state, action) {
      const price = action.payload;
      const allRestaurants = state.restaurants;
      state.displayRestaurants = Object.fromEntries(
        Object.entries(allRestaurants).filter(
          ([_, restaurant]) => restaurant.price === price
        )
      );
    },
    sortRestaurantByHighestRating(state) {
      const allRestaurants = Object.values(state.restaurants);
      const sortedRestaurants = allRestaurants.sort((a, b) => {
        return b.avgRating - a.avgRating;
      });
      state.displayRestaurants = sortedRestaurants.reduce((acc, restaurant) => {
        acc[restaurant.id] = restaurant;
        return acc;
      }, {});
    },
    sortRestaurantByMostReviews(state) {
      const allRestaurants = Object.values(state.restaurants);
      const sortedRestaurants = allRestaurants.sort((a, b) => {
        return b.dogReviewCount - a.dogReviewCount;
      });
      state.displayRestaurants = sortedRestaurants.reduce((acc, restaurant) => {
        acc[restaurant.id] = restaurant;
        return acc;
      }, {});
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllRestaurants.fulfilled, (state, action) => {
        // restaurants array
        let res = {};
        action.payload.restaurants.forEach((restaurant) => {
          res[restaurant.id] = restaurant;
        });
        state.restaurants = res;
        // state.displayRestaurants = res;
        state.isLoading = false;
        state.totalRestaurants = action.payload.totalResults;
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
        state.isLoading = false;
      })
      .addCase(getRestaurantById.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getFirstPage.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getFirstPage.fulfilled, (state, action) => {
        let res = {};
        action.payload.restaurants.forEach((restaurant) => {
          res[restaurant.id] = restaurant;
        });
        state.restaurants = res;
        state.displayRestaurants = res;
        state.currentPage = 1;
        state.isLoading = false;
      });
  },
});
export const getAllRestaurants = createAsyncThunk(
  "restaurants/getAllRestaurants",
  async (_, { rejectWithValue }) => {
    try {
      const totalPages = 24;
      const allRestaurants = [];

      for (let page = 1; page <= totalPages; page++) {
        const response = await fetch(`/api/restaurants?page=${page}`);
        const data = await response.json();

        if (!response.ok) {
          return rejectWithValue(data);
        }

        allRestaurants.push(...data.restaurants);
      }

      return { restaurants: allRestaurants };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const getAllRestaurants = createAsyncThunk(
//   "restaurants/getAllRestaurants",
//   async ({ page, filter }, { rejectWithValue }) => {
//     let url = `/api/restaurants?page=${page}`;
//     if (filter) {
//       url += `&filter=${filter}`;
//     }
//     const response = await fetch(url);
//     const data = await response.json();

//     if (!response.ok) return rejectWithValue(data);
//     return data;
//   }
// );
export const getFirstPage = createAsyncThunk(
  "restaurants/getFirstPage",
  async (_, { rejectWithValue }) => {
    const response = await fetch(`/api/restaurants?page=1`);
    const data = await response.json();

    if (!response.ok) return rejectWithValue(data);
    return data;
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
} = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
