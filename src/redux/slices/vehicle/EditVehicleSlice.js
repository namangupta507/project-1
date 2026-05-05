import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const EditVehicleSlice = createSlice({
    name: "editVehicle",
    initialState,
    reducers: {
        editVehicleRequest(state) {
            state.loading = true;
        },
        editVehicleRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        editVehicleRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        editVehicleStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    editVehicleRequest,
    editVehicleRequestSuccess,
    editVehicleRequestError,
    editVehicleStateReset,
} = EditVehicleSlice.actions;

export default EditVehicleSlice.reducer;
