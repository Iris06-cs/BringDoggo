import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviewsById: {},
    currentUserReviewIds: [],
    reviewIdsByUserId: {},
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviews.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        action.payload.forEach((review) => {
          state.reviewsById[review.id] = review;
        });
        state.isLoading = false;
      })
      .addCase(getReviewsByUserId.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getReviewsByUserId.fulfilled, (state, action) => {
        const { userId, reviews } = action.payload; //array
        if (reviews.length) {
          if (!state.reviewIdsByUserId[userId])
            state.reviewIdsByUserId[userId] = [];
          const reviewIds = reviews.map((review) => review.id);
          state.reviewIdsByUserId[userId] = [...reviewIds];
        } else state.reviewIdsByUserId[userId] = [];
        state.isLoading = false;
      })
      .addCase(getReviewsByUserId.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getCurrentUserReviews.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getCurrentUserReviews.fulfilled, (state, action) => {
        const reviews = action.payload;
        if (reviews.length) {
          const reviewIds = reviews.map((review) => review.id);
          state.currentUserReviewIds = [...reviewIds];
        } else state.currentUserReviewIds = [];
        state.isLoading = false;
      })
      .addCase(getCurrentUserReviews.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(addReview.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        const newReview = action.payload;
        state.reviewsById[newReview.id] = newReview;
        state.currentUserReviewIds.push(newReview.id);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(updateReview.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const updatedReview = action.payload;
        state.reviewsById[updatedReview.id] = updatedReview;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        const reviewId = action.payload;
        delete state.reviewsById[reviewId];
        state.currentUserReviewIds = state.currentUserReviewIds.filter(
          (id) => id !== reviewId
        );
        Object.keys(state.reviewIdsByUserId).forEach((userId) => {
          if (state.reviewIdsByUserId[userId])
            state.reviewIdsByUserId[userId] = state.reviewIdsByUserId[
              userId
            ].filter((id) => id !== reviewId);
        });
        state.isLoading = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});
export const getAllReviews = createAsyncThunk(
  "reviews/getAllReviews",
  async (_, { rejectWithValue }) => {
    const response = await fetch("/api/reviews/");
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data);
    return data.Reviews;
  }
);
// export const getReviewsByRestaurantId = createAsyncThunk(
//   "reviews/getReviewsByRestaurantId",
//   async (restaurantId, { rejectWithValue }) => {
//     const response = await fetch(`/api/restaurants/${restaurantId}/reviews`);
//     const data = await response.json();
//     if (!response.ok) return rejectWithValue(data);
//     return data.Reviews;
//   }
// );
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
    return { userId: userId, reviews: data.Reviews };
  }
);
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async ({ stars, review_detail, restaurantId }, { rejectWithValue }) => {
    const response = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stars, review_detail }),
    });
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data;
  }
);
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ stars, review_detail, reviewId }, { rejectWithValue }) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stars, review_detail }),
    });
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data;
  }
);
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return reviewId;
  }
);
// selectors
export const selectAllReviews = (state) => state.reviews.reviewsById;

export const selectCurrentUserReviews = (state) => {
  const currentUserReviewIds = state.reviews.currentUserReviewIds;
  const reviewsById = state.reviews.reviewsById;
  return currentUserReviewIds.map((reviewId) => reviewsById[reviewId]);
};
export const selectReviewsByUserId = (state, userId) => {
  const userReviewIds = state.reviews.reviewIdsByUserId[userId] || [];
  const reviewsById = state.reviews.reviewsById;
  return userReviewIds.map((reviewId) => reviewsById[reviewId]);
};
export default reviewsSlice.reducer;
