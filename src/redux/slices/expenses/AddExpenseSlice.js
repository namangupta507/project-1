import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddExpenseSlice = createSlice({
    name: "addExpense",
    initialState,
    reducers: {
        addExpenseRequest(state) {
            state.loading = true;
        },
        addExpenseRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addExpenseRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addExpenseStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addExpenseRequest,
    addExpenseRequestSuccess,
    addExpenseRequestError,
    addExpenseStateReset,
} = AddExpenseSlice.actions;

export default AddExpenseSlice.reducer;
