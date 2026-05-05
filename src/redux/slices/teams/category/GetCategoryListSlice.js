import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const CategoryDataSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        getCategoriesRequest(state) {
            state.loading = true;
        },
        getCategoriesRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getCategoriesRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getCategoriesRequest,
    getCategoriesRequestSuccess,
    getCategoriesRequestError,
} = CategoryDataSlice.actions;

export default CategoryDataSlice.reducer;
