import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const UploadMultipleSlice = createSlice({
    name: "uploadMultiple",
    initialState,
    reducers: {
        uploadMultipleRequest(state) {
            state.loading = true;
        },
        uploadMultipleRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        uploadMultipleRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        uploadMultipleStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    uploadMultipleRequest,
    uploadMultipleRequestSuccess,
    uploadMultipleRequestError,
    uploadMultipleStateReset,
} = UploadMultipleSlice.actions;

export default UploadMultipleSlice.reducer;
