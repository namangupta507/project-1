
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const ListSlice = createSlice({
    name: "reimbursementList",
    initialState,
    reducers: {
        reimbursementListRequest(state) {
            state.loading = true;
        },
        reimbursementListRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        reimbursementListRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    reimbursementListRequest,
    reimbursementListRequestSuccess,
    reimbursementListRequestError,
} = ListSlice.actions;

export default ListSlice.reducer;
