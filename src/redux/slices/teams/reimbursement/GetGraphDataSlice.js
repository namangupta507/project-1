
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const GraphDataSlice = createSlice({
    name: "reimbursementGraphData",
    initialState,
    reducers: {
        reimbursementGraphDataRequest(state) {
            state.loading = true;
        },
        reimbursementGraphDataRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        reimbursementGraphDataRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    reimbursementGraphDataRequest,
    reimbursementGraphDataRequestSuccess,
    reimbursementGraphDataRequestError,
} = GraphDataSlice.actions;

export default GraphDataSlice.reducer;
