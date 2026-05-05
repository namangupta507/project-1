import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddRateSlice = createSlice({
    name: "addRate",
    initialState,
    reducers: {
        addRateRequest(state) {
            state.loading = true;
        },
        addRateRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addRateRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addRateStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addRateRequest,
    addRateRequestSuccess,
    addRateRequestError,
    addRateStateReset,
} = AddRateSlice.actions;

export default AddRateSlice.reducer;
