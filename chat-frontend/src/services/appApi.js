import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//define a service using a base URL

// make query to database without using fetch or axios, we use this instead, it's a hook-like function
const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_DEV_BASE_URL,
  }),
  endpoints: (builder) => ({
    // signUp endpoint
    signUp: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
    }),

    // login user endpoint
    login: builder.mutation({
      query: (user) => ({
        url: '/users/login',
        method: 'POST',
        body: user,
      }),
    }),

    // logout user endpoint
    logout: builder.mutation({
      query: (payload) => ({
        url: '/logout',
        method: 'DELETE',
        body: payload,
      }),
    }),
  }),
});

export const { useSignUpMutation, useLoginMutation, useLogoutMutation } =
  appApi;

export default appApi;
