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
  expiresAt: number | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  remember: false,
  expiresAt: null,
};

type CredentialsPayload = {
  token: string;
  user?: AuthUser | null;
  remember?: boolean;
  expiresAt?: number | null;
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
      if (typeof action.payload.expiresAt === 'number' || action.payload.expiresAt === null) {
        state.expiresAt = action.payload.expiresAt ?? null;
      }
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.expiresAt = null;
    },
    setRememberPreference: (state, action: PayloadAction<boolean>) => {
      state.remember = action.payload;
    },
    setTokenExpiry: (state, action: PayloadAction<number | null>) => {
      state.expiresAt = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setRememberPreference, setTokenExpiry } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
