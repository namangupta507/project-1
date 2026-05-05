import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const EditExpenseSlice = createSlice({
    name: "editExpense",
    initialState,
    reducers: {
        editExpenseRequest(state) {
            state.loading = true;
        },
        editExpenseRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        editExpenseRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        editExpenseStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    editExpenseRequest,
    editExpenseRequestSuccess,
    editExpenseRequestError,
    editExpenseStateReset,
} = EditExpenseSlice.actions;

export default EditExpenseSlice.reducer;
