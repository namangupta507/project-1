import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddReadingSlice = createSlice({
    name: "addReading",
    initialState,
    reducers: {
        addReadingRequest(state) {
            state.loading = true;
        },
        addReadingRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addReadingRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addReadingStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addReadingRequest,
    addReadingRequestSuccess,
    addReadingRequestError,
    addReadingStateReset,
} = AddReadingSlice.actions;

export default AddReadingSlice.reducer;
