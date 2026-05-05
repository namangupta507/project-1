import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddExpenseToReportsSlice = createSlice({
    name: "addExpenseToReports",
    initialState,
    reducers: {
        addExpenseToReportsRequest(state) {
            state.loading = true;
        },
        addExpenseToReportsRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addExpenseToReportsRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addExpenseToReportsStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addExpenseToReportsRequest,
    addExpenseToReportsRequestSuccess,
    addExpenseToReportsRequestError,
    addExpenseToReportsStateReset,
} = AddExpenseToReportsSlice.actions;

export default AddExpenseToReportsSlice.reducer;
