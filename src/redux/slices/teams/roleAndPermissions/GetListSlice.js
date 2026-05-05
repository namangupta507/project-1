
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const ListSlice = createSlice({
    name: "list",
    initialState,
    reducers: {
        getListRequest(state) {
            state.loading = true;
        },
        getListRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getListRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getListRequest,
    getListRequestSuccess,
    getListRequestError,
} = ListSlice.actions;

export default ListSlice.reducer;
