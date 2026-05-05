import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const VehiclesListSlice = createSlice({
    name: "vehicles",
    initialState,
    reducers: {
        getVehiclesRequest(state) {
            state.loading = true;
        },
        getVehiclesRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getVehiclesRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getVehiclesRequest,
    getVehiclesRequestSuccess,
    getVehiclesRequestError,
} = VehiclesListSlice.actions;

export default VehiclesListSlice.reducer;
