import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const SubmitSlice = createSlice({
    name: "submit",
    initialState,
    reducers: {
        submitRequest(state) {
            state.loading = true;
        },
        submitRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        submitRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        submitStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    submitRequest,
    submitRequestSuccess,
    submitRequestError,
    submitStateReset,
} = SubmitSlice.actions;

export default SubmitSlice.reducer;
