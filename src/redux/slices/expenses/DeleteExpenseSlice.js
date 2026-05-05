import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const DeleteExpenseSlice = createSlice({
    name: "deleteExpense",
    initialState,
    reducers: {
        deleteExpenseRequest(state) {
            state.loading = true;
        },
        deleteExpenseRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        deleteExpenseRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        deleteExpenseStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    deleteExpenseRequest,
    deleteExpenseRequestSuccess,
    deleteExpenseRequestError,
    deleteExpenseStateReset,
} = DeleteExpenseSlice.actions;

export default DeleteExpenseSlice.reducer;
