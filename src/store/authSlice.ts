import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token?: string | null;
  refresh?: string | null;
  username?: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  refresh: null,
  username: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;

        email: string;
        user: User | null;
      }>,
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.refresh = null;
      state.username = null;
      state.isAuthenticated = false;
      state.user = null;
    },
    updateToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    updateUserRole: (state, action: PayloadAction<{ is_artisan: boolean }>) => {
      if (state.user) {
        state.user.is_artisan = action.payload.is_artisan;
      }
    },
  },
});

export const { login, logout, updateToken, updateUserRole } = authSlice.actions;
export default authSlice.reducer;
