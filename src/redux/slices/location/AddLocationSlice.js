import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddLocationSlice = createSlice({
    name: "addLocation",
    initialState,
    reducers: {
        addLocationRequest(state) {
            state.loading = true;
        },
        addLocationRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addLocationRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addLocationStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addLocationRequest,
    addLocationRequestSuccess,
    addLocationRequestError,
    addLocationStateReset,
} = AddLocationSlice.actions;

export default AddLocationSlice.reducer;
