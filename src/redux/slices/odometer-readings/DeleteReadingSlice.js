import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const DeleteReadingSlice = createSlice({
    name: "deleteReading",
    initialState,
    reducers: {
        deleteReadingRequest(state) {
            state.loading = true;
        },
        deleteReadingRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        deleteReadingRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        deleteReadingStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    deleteReadingRequest,
    deleteReadingRequestSuccess,
    deleteReadingRequestError,
    deleteReadingStateReset,
} = DeleteReadingSlice.actions;

export default DeleteReadingSlice.reducer;
