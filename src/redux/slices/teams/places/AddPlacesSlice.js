import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddPlacesSlice = createSlice({
    name: "addPlaces",
    initialState,
    reducers: {
        addPlacesRequest(state) {
            state.loading = true;
        },
        addPlacesRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addPlacesRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addPlacesStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addPlacesRequest,
    addPlacesRequestSuccess,
    addPlacesRequestError,
    addPlacesStateReset,
} = AddPlacesSlice.actions;

export default AddPlacesSlice.reducer;
