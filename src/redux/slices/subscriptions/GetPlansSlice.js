import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const plansSlice = createSlice({
    name: "plansSlice",
    initialState,
    reducers: {
        plansRequest(state) {
            state.loading = true;
        },
        plansRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        plansRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    plansRequest,
    plansRequestSuccess,
    plansRequestError,
} = plansSlice.actions;

export default plansSlice.reducer;
