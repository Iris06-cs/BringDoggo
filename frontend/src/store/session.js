// // constants
// const SET_USER = "session/SET_USER";
// const REMOVE_USER = "session/REMOVE_USER";

// const setUser = (user) => ({
// 	type: SET_USER,
// 	payload: user,
// });

// const removeUser = () => ({
// 	type: REMOVE_USER,
// });

// const initialState = { user: null };

// export const authenticate = () => async (dispatch) => {
// 	const response = await fetch("/api/auth/", {
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	});
// 	if (response.ok) {
// 		const data = await response.json();
// 		if (data.errors) {
// 			return;
// 		}

// 		dispatch(setUser(data));
// 	}
// };

// export const login = (email, password) => async (dispatch) => {
// 	const response = await fetch("/api/auth/login", {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			email,
// 			password,
// 		}),
// 	});

// 	if (response.ok) {
// 		const data = await response.json();
// 		dispatch(setUser(data));
// 		return null;
// 	} else if (response.status < 500) {
// 		const data = await response.json();
// 		if (data.errors) {
// 			return data.errors;
// 		}
// 	} else {
// 		return ["An error occurred. Please try again."];
// 	}
// };

// export const logout = () => async (dispatch) => {
// 	const response = await fetch("/api/auth/logout", {
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	});

// 	if (response.ok) {
// 		dispatch(removeUser());
// 	}
// };

// export const signUp = (username, email, password) => async (dispatch) => {
// 	const response = await fetch("/api/auth/signup", {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({
// 			username,
// 			email,
// 			password,
// 		}),
// 	});

// 	if (response.ok) {
// 		const data = await response.json();
// 		dispatch(setUser(data));
// 		return null;
// 	} else if (response.status < 500) {
// 		const data = await response.json();
// 		if (data.errors) {
// 			return data.errors;
// 		}
// 	} else {
// 		return ["An error occurred. Please try again."];
// 	}
// };

// export default function reducer(state = initialState, action) {
// 	switch (action.type) {
// 		case SET_USER:
// 			return { user: action.payload };
// 		case REMOVE_USER:
// 			return { user: null };
// 		default:
// 			return state;
// 	}
// }

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    user: null,
    error: null,
    validationErrors: null,
    redirectMessage: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    setRedirectMessage: (state, action) => {
      state.redirectMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload.message;
        state.validationErrors = action.payload.errors;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(signUp.pending, (state) => {
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload.message;
        state.validationErrors = action.payload.errors;
        state.user = null;
      });
  },
});
export const authenticate = createAsyncThunk(
  "session/authenticate",
  async () => {
    const response = await fetch("/api/auth/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();

      if (data.errors) {
        return;
      }

      return data.user;
    }
  }
);
export const login = createAsyncThunk(
  "session/login",
  async ({ email, password }, { rejectWithValue }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (data.errors) {
        return rejectWithValue({ errors: data.errors });
      }
    }

    return data.user;
  }
);
export const logout = createAsyncThunk("session/logout", async () => {
  const response = await fetch("/api/auth/logout", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return true;
  }
});
export const signUp = createAsyncThunk(
  "session/signUp",
  async (
    { username, email, password, lastname, firstname },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          lastname,
          firstname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          return rejectWithValue({ errors: data.errors });
        }
      }

      return data.user;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);
export const { setUser, removeUser, clearErrors, setRedirectMessage } =
  sessionSlice.actions;

export default sessionSlice.reducer;
