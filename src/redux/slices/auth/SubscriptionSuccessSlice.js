import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const SubscriptionSuccessSlice = createSlice({
    name: "subscriptionSuccessRequest",
    initialState,
    reducers: {
        subscriptionSuccessRequest(state) {
            state.loading = true;
        },
        subscriptionSuccessRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        subscriptionSuccessRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        subscriptionSuccessStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    subscriptionSuccessRequest,
    subscriptionSuccessRequestSuccess,
    subscriptionSuccessRequestError,
    subscriptionSuccessStateReset,
} = SubscriptionSuccessSlice.actions;

export default SubscriptionSuccessSlice.reducer;
