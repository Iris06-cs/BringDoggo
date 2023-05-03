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
    builder
      .addCase(getReviewsByRestaurantId.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getReviewsByRestaurantId.fulfilled, (state, action) => {
        action.payload.forEach((review) => {
          state.reviewsById[review.id] = review;
          if (!(review.restaurantId in state.reviewIdsByRestaurantId))
            state.reviewIdsByRestaurantId[review.restaurantId] = [];
          // Check if the review id is already in the array before pushing
          if (
            !state.reviewIdsByRestaurantId[review.restaurantId].includes(
              review.id
            )
          )
            state.reviewIdsByRestaurantId[review.restaurantId].push(review.id);
        });
        state.isLoading = false;
      })
      .addCase(getReviewsByRestaurantId.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getReviewsByUserId.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getReviewsByUserId.fulfilled, (state, action) => {})
      .addCase(getReviewsByUserId.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getCurrentUserReviews.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getCurrentUserReviews.fulfilled, (state, action) => {})
      .addCase(getCurrentUserReviews.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
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
export const getCurrentUserReviews = createAsyncThunk(
  "reviews/getCurrentUserReviews",
  async (_, { rejectWithValue }) => {
    const response = await fetch(`/api/reviews/current`);
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data);
    return data.Reviews;
  }
);
export const getReviewsByUserId = createAsyncThunk(
  "reviews/getReviewsByUserId",
  async (userId, { rejectWithValue }) => {
    const response = await fetch(`/api/users/${userId}/reviews`);
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data);
    return data.Reviews;
  }
);
export default reviewsSlice.reducer;
