import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddCategorySlice = createSlice({
    name: "addCategory",
    initialState,
    reducers: {
        addCategoryRequest(state) {
            state.loading = true;
        },
        addCategoryRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addCategoryRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addCategoryStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addCategoryRequest,
    addCategoryRequestSuccess,
    addCategoryRequestError,
    addCategoryStateReset,
} = AddCategorySlice.actions;

export default AddCategorySlice.reducer;
