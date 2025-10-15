'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthUser = {
  id?: string;
  fullName?: string;
  email?: string;
  [key: string]: unknown;
};

export type AuthState = {
  token: string | null;
  user: AuthUser | null;
  remember: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  remember: false,
};

type CredentialsPayload = {
  token: string;
  user?: AuthUser | null;
  remember?: boolean;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user ?? null;
      if (typeof action.payload.remember === 'boolean') {
        state.remember = action.payload.remember;
      }
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
    },
    setRememberPreference: (state, action: PayloadAction<boolean>) => {
      state.remember = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setRememberPreference } = authSlice.actions;
export const authReducer = authSlice.reducer;
