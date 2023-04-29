import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: {
    restaurants: {},
    error: null,
    isLoading: false,
    totalRestaurants: null,
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
      });
  },
});
export const getAllRestaurants = createAsyncThunk(
  "restaurants/getAllRestaurants",
  async (page = 1, { rejectWithValue }) => {
    const response = await fetch(`/api/restaurants/?page=${page}`);
    const data = await response.json();

    if (!response.ok) return rejectWithValue(data);
    return data;
  }
);

export default restaurantsSlice.reducer;
