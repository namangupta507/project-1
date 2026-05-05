import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const SummaryDataSlice = createSlice({
    name: "summary",
    initialState,
    reducers: {
        getSummaryRequest(state) {
            state.loading = true;
        },
        getSummaryRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getSummaryRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getSummaryRequest,
    getSummaryRequestSuccess,
    getSummaryRequestError,
} = SummaryDataSlice.actions;

export default SummaryDataSlice.reducer;
