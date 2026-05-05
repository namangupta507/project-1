import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const DeleteAccountSlice = createSlice({
    name: "deleteAccount",
    initialState,
    reducers: {
        deleteAccountRequest(state) {
            state.loading = true;
        },
        deleteAccountRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        deleteAccountRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        deleteAccountStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    deleteAccountRequest,
    deleteAccountRequestSuccess,
    deleteAccountRequestError,
    deleteAccountStateReset,
} = DeleteAccountSlice.actions;

export default DeleteAccountSlice.reducer;
