import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const OdometerReadingDataSlice = createSlice({
    name: "odometer-reading",
    initialState,
    reducers: {
        getReadingRequest(state) {
            state.loading = true;
        },
        getReadingRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getReadingRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getReadingRequest,
    getReadingRequestSuccess,
    getReadingRequestError,
} = OdometerReadingDataSlice.actions;

export default OdometerReadingDataSlice.reducer;
