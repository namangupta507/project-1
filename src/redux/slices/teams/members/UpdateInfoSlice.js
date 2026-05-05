import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const UpdateInfoSlice = createSlice({
    name: "updateInfo",
    initialState,
    reducers: {
        updateInfoRequest(state) {
            state.loading = true;
        },
        updateInfoRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        updateInfoRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        updateInfoStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    updateInfoRequest,
    updateInfoRequestSuccess,
    updateInfoRequestError,
    updateInfoStateReset,
} = UpdateInfoSlice.actions;

export default UpdateInfoSlice.reducer;
