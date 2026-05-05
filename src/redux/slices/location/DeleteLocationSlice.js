import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const DeleteLocationSlice = createSlice({
    name: "deleteLocation",
    initialState,
    reducers: {
        deleteLocationRequest(state) {
            state.loading = true;
        },
        deleteLocationRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        deleteLocationRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        deleteLocationStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    deleteLocationRequest,
    deleteLocationRequestSuccess,
    deleteLocationRequestError,
    deleteLocationStateReset,
} = DeleteLocationSlice.actions;

export default DeleteLocationSlice.reducer;
