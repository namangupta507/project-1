import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const DeleteVehicleSlice = createSlice({
    name: "deleteVehicle",
    initialState,
    reducers: {
        deleteVehicleRequest(state) {
            state.loading = true;
        },
        deleteVehicleRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        deleteVehicleRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        deleteVehicleStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    deleteVehicleRequest,
    deleteVehicleRequestSuccess,
    deleteVehicleRequestError,
    deleteVehicleStateReset,
} = DeleteVehicleSlice.actions;

export default DeleteVehicleSlice.reducer;
