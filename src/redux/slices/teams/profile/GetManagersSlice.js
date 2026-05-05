
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const ManagersListSlice = createSlice({
    name: "managersList",
    initialState,
    reducers: {
        getManagersListRequest(state) {
            state.loading = true;
        },
        getManagersListRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getManagersListRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getManagersListRequest,
    getManagersListRequestSuccess,
    getManagersListRequestError,
} = ManagersListSlice.actions;

export default ManagersListSlice.reducer;
