import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const TripsDataSlice = createSlice({
    name: "trips",
    initialState,
    reducers: {
        getTripsRequest(state) {
            state.loading = true;
        },
        getTripsRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getTripsRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getTripsRequest,
    getTripsRequestSuccess,
    getTripsRequestError,
} = TripsDataSlice.actions;

export default TripsDataSlice.reducer;
