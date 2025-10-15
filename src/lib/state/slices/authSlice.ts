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
};

const initialState: AuthState = {
  token: null,
  user: null,
};

type CredentialsPayload = {
  token: string;
  user?: AuthUser | null;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user ?? null;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
