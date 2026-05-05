import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const UpdateRateSlice = createSlice({
    name: "updateRate",
    initialState,
    reducers: {
        updateRateRequest(state) {
            state.loading = true;
        },
        updateRateRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        updateRateRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        updateRateStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    updateRateRequest,
    updateRateRequestSuccess,
    updateRateRequestError,
    updateRateStateReset,
} = UpdateRateSlice.actions;

export default UpdateRateSlice.reducer;
