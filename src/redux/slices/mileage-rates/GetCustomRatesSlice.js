import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const CustomRatesDataSlice = createSlice({
    name: "custom-rates",
    initialState,
    reducers: {
        getCustomRatesRequest(state) {
            state.loading = true;
        },
        getCustomRatesRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getCustomRatesRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getCustomRatesRequest,
    getCustomRatesRequestSuccess,
    getCustomRatesRequestError,
} = CustomRatesDataSlice.actions;

export default CustomRatesDataSlice.reducer;
