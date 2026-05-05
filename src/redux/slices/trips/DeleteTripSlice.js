import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const DeleteTripSlice = createSlice({
    name: "deleteTrip",
    initialState,
    reducers: {
        deleteTripRequest(state) {
            state.loading = true;
        },
        deleteTripRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        deleteTripRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        deleteTripStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    deleteTripRequest,
    deleteTripRequestSuccess,
    deleteTripRequestError,
    deleteTripStateReset,
} = DeleteTripSlice.actions;

export default DeleteTripSlice.reducer;
