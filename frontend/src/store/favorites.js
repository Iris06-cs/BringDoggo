import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favoritesById: {},
    currentUserFavoritesId: [],
    userPublicFavsId: [],
    error: null,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFavs.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getAllFavs.fulfilled, (state, action) => {
        action.payload.forEach((favorite) => {
          state.favoritesById[favorite.id] = favorite;
        });
        state.isLoading = false;
      })
      .addCase(getAllFavs.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getCurrentUserFavs.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getCurrentUserFavs.fulfilled, (state, action) => {
        const favs = action.payload;
        if (favs.length) {
          const favIds = favs.map((fav) => fav.id);
          state.currentUserFavoritesId = [...favIds];
        } else state.currentUserFavoritesId = [];
        state.isLoading = false;
      })
      .addCase(getCurrentUserFavs.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserPublicFavs.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(getUserPublicFavs.fulfilled, (state, action) => {
        const favs = action.payload;
        if (favs.length) {
          const favIds = favs.map((fav) => fav.id);
          state.userPublicFavsId = [...favIds];
        } else state.userPublicFavsId = [];
        state.isLoading = false;
      })
      .addCase(getUserPublicFavs.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(addFav.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(addFav.fulfilled, (state, action) => {
        const newFav = action.payload;
        state.favoritesById[newFav.id] = newFav;
        state.currentUserFavoritesId.push(newFav.id);
      })
      .addCase(addFav.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(updateFav.pending, (state, action) => {
        state.error = action.payload;
        state.isLoading = true;
      })
      .addCase(updateFav.fulfilled, (state, action) => {
        const updatedFav = action.payload;
        state.favoritesById[updatedFav.id] = updatedFav;
      })
      .addCase(updateFav.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(deleteFav.fulfilled, (state, action) => {
        const favId = action.payload;
        delete state.favoritesById[favId];
        state.currentUserFavoritesId = state.currentUserFavoritesId.filter(
          (id) => id !== favId
        );
        state.userPublicFavsId = state.userPublicFavsId.filter(
          (id) => id !== favId
        );
        state.isLoading = false;
      })
      .addCase(deleteFav.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});
export const getAllFavs = createAsyncThunk(
  "favorites/getAllFavs",
  async (_, { rejectWithValue }) => {
    const response = await fetch("/api/favorites/");
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data);
    return data.Favorites;
  }
);
export const getCurrentUserFavs = createAsyncThunk(
  "favorites/getCurrentUserFavs",
  async (_, { rejectWithValue }) => {
    const response = await fetch("/api/favorites/current");
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data);
    return data.Favorites;
  }
);
export const getUserPublicFavs = createAsyncThunk(
  "favorites/getUserPublicFavs",
  async (userId, { rejectWithValue }) => {
    const response = await fetch(`/api/users/${userId}/favorites`);
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data);
    return data.Favorites;
  }
);
export const addFav = createAsyncThunk(
  "favorites/addFav",
  async (
    { title, description, is_public, restaurantId },
    { rejectWithValue }
  ) => {
    const response = await fetch(`/api/restaurants/${restaurantId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, is_public }),
    });
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data;
  }
);
export const updateFav = createAsyncThunk(
  "favorites/updateFav",
  async ({ title, description, is_public, favId }, { rejectWithValue }) => {
    const response = await fetch(`/api/favorites/${favId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, is_public }),
    });
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data;
  }
);
export const deleteFav = createAsyncThunk(
  "favorites/deleteFav",
  async (favId, { rejectWithValue }) => {
    const response = await fetch(`/api/favorites/${favId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return favId;
  }
);
// selectors
export const selectAllFavs = (state) => state.favorites.favoritesById;
export const selectCurrUserFavs = (state) => {
  const favsById = state.favorites.favoritesById;
  const currUserFavIds = state.favorites.currentUserFavoritesId;
  const res = {};
  currUserFavIds.forEach((id) => {
    if (favsById[id]) {
      res[id] = favsById[id];
    }
  });

  return res;
};

export default favoritesSlice.reducer;
