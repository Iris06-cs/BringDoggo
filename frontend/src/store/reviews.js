import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviewsById: {},
    currentUserReviewIds: [],
    reviewIdsByRestaurantId: {},
    reviewIdsByUserId: {},
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder.addCase(getReviewsByRestaurantId.pending, (state, action) => {});
  },
});
export const getReviewsByRestaurantId = createAsyncThunk(
  "reviews/getReviewsByRestaurantId",
  async (restaurantId, { rejectWithValue }) => {
    const response = await fetch(`/api/restaurants/${restaurantId}/reviews`);
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data);
    return data.Reviews;
  }
);
export default reviewsSlice.reducer;
