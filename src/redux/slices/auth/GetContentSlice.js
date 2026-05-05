
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const GetContentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {
        getContentRequest(state) {
            state.loading = true;
        },
        getContentRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getContentRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getContentRequest,
    getContentRequestSuccess,
    getContentRequestError,
} = GetContentSlice.actions;

export default GetContentSlice.reducer;
