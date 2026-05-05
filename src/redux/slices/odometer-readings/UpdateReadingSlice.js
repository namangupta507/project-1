import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const UpdateReadingSlice = createSlice({
    name: "updateReading",
    initialState,
    reducers: {
        updateReadingRequest(state) {
            state.loading = true;
        },
        updateReadingRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        updateReadingRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        updateReadingStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    updateReadingRequest,
    updateReadingRequestSuccess,
    updateReadingRequestError,
    updateReadingStateReset,
} = UpdateReadingSlice.actions;

export default UpdateReadingSlice.reducer;
