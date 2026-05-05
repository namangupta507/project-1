import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddVehicleSlice = createSlice({
    name: "addVehicle",
    initialState,
    reducers: {
        addVehicleRequest(state) {
            state.loading = true;
        },
        addVehicleRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addVehicleRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addVehicleStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addVehicleRequest,
    addVehicleRequestSuccess,
    addVehicleRequestError,
    addVehicleStateReset,
} = AddVehicleSlice.actions;

export default AddVehicleSlice.reducer;
