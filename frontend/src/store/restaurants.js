import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: {
    restaurants: {},
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRestaurants.fulfilled, (state, action) => {
        state.restaurants = action.payload;
      })
      .addCase(getAllRestaurants.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const getAllRestaurants = createAsyncThunk(
  "restaurants/getAllRestaurants",
  async (_, { rejectWithValue }) => {
    const response = await fetch("/api/restaurants/");
    const data = await response.json();

    if (!response.ok) return rejectWithValue(data);
    // restaurants array
    let res = {};

    data.restaurants.forEach((restaurant) => {
      res[restaurant.id] = restaurant;
    });
    return res;
  }
);

export default restaurantsSlice.reducer;
