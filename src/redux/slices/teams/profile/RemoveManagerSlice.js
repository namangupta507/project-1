import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const RemoveManagerSlice = createSlice({
    name: "removeManager",
    initialState,
    reducers: {
        removeManagerRequest(state) {
            state.loading = true;
        },
        removeManagerRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        removeManagerRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        removeManagerStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    removeManagerRequest,
    removeManagerRequestSuccess,
    removeManagerRequestError,
    removeManagerStateReset,
} = RemoveManagerSlice.actions;

export default RemoveManagerSlice.reducer;
