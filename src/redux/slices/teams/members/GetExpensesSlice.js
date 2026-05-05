import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const ExpensesDataSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {
        getExpensesRequest(state) {
            state.loading = true;
        },
        getExpensesRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getExpensesRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getExpensesRequest,
    getExpensesRequestSuccess,
    getExpensesRequestError,
} = ExpensesDataSlice.actions;

export default ExpensesDataSlice.reducer;
