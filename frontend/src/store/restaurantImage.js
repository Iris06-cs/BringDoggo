import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const restaurantImageSlice = createSlice({
  name: "restaurantImages",
  initialState: {
    imageById: {},
    currUserImageIds: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRestaurantImage.fulfilled, (state, action) => {
        const newImage = action.payload;
        state.imageById[newImage.id] = newImage;
        state.currUserImageIds.push(newImage.id);
      })
      .addCase(deleteRestaurantImage.fulfilled, (state, action) => {
        const imageId = action.payload;
        delete state.imageById[imageId];
        state.currUserImageIds = state.currUserImageIds.filter(
          (id) => id !== imageId
        );
      })
      .addCase(getAllRestaurantImages.fulfilled, (state, action) => {
        action.payload.forEach((image) => {
          state.imageById[image.id] = image;
        });
      });
  },
});
export const getAllRestaurantImages = createAsyncThunk(
  "restaurantImages/getAllRestaurantImages",
  async (_, { rejectWithValue }) => {
    const res = await fetch("/api/restaurant-images/");
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue(data);
    }

    return data.images;
  }
);
export const addRestaurantImage = createAsyncThunk(
  "restaurantImages/addRestaurantImage",
  async (formData, { rejectWithValue }) => {
    const restaurantId = formData.get("restaurant_id");

    const res = await fetch(`/api/restaurants/${restaurantId}/images`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue(data);
    }

    return data;
  }
);
export const deleteRestaurantImage = createAsyncThunk(
  "restaurantImages/deleteRestaurantImage",
  async (imageId, { rejectWithValue }) => {
    const res = await fetch(`/api/restaurant-images/${imageId}`);
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue(data);
    }
    return imageId;
  }
);
export default restaurantImageSlice.reducer;
