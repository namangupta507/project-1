import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const LocationsDataSlice = createSlice({
    name: "locations",
    initialState,
    reducers: {
        getLocationsRequest(state) {
            state.loading = true;
        },
        getLocationsRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getLocationsRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getLocationsRequest,
    getLocationsRequestSuccess,
    getLocationsRequestError,
} = LocationsDataSlice.actions;

export default LocationsDataSlice.reducer;
