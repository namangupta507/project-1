import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddTripSlice = createSlice({
    name: "addTrip",
    initialState,
    reducers: {
        addTripRequest(state) {
            state.loading = true;
        },
        addTripRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addTripRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addTripStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addTripRequest,
    addTripRequestSuccess,
    addTripRequestError,
    addTripStateReset,
} = AddTripSlice.actions;

export default AddTripSlice.reducer;
