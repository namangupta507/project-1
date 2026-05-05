import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const EditTripSlice = createSlice({
    name: "editTrip",
    initialState,
    reducers: {
        editTripRequest(state) {
            state.loading = true;
        },
        editTripRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        editTripRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        editTripStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    editTripRequest,
    editTripRequestSuccess,
    editTripRequestError,
    editTripStateReset,
} = EditTripSlice.actions;

export default EditTripSlice.reducer;
