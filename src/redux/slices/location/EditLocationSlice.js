import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const EditLocationSlice = createSlice({
    name: "editLocation",
    initialState,
    reducers: {
        editLocationRequest(state) {
            state.loading = true;
        },
        editLocationRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        editLocationRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        editLocationStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    editLocationRequest,
    editLocationRequestSuccess,
    editLocationRequestError,
    editLocationStateReset,
} = EditLocationSlice.actions;

export default EditLocationSlice.reducer;
