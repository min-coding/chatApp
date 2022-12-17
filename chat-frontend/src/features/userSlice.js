import { createSlice } from '@reduxjs/toolkit';
import appApi from '../services/appApi';

export const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    // it's all a reducer function, the parameter are action (type and payload)
    addNotifications: (state, { payload }) => {},
    resetNotifications: (state, { payload }) => {},
  },

  extraReducers: (builder) => {
    //save user after signup

    /*
    When the promise is fulfilled, return the payload (user) as the new state
    */
    builder.addMatcher(
      appApi.endpoints.signUp.matchFulfilled,
      (state, { payload }) => payload
    );

    // save user after login
    builder.addMatcher(
      appApi.endpoints.login.matchFulfilled,
      (state, { payload }) => payload
    );

    //logout destroy user session
    builder.addMatcher(appApi.endpoints.logout.matchFulfilled, () => null);
  },
});

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;
