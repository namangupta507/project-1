
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const PlacesListSlice = createSlice({
    name: "placesList",
    initialState,
    reducers: {
        getPlacesListRequest(state) {
            state.loading = true;
        },
        getPlacesListRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getPlacesListRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getPlacesListRequest,
    getPlacesListRequestSuccess,
    getPlacesListRequestError,
} = PlacesListSlice.actions;

export default PlacesListSlice.reducer;
