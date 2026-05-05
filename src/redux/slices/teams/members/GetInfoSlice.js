import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const InfoSlice = createSlice({
    name: "info",
    initialState,
    reducers: {
        infoRequest(state) {
            state.loading = true;
        },
        infoRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        infoRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    infoRequest,
    infoRequestSuccess,
    infoRequestError,
} = InfoSlice.actions;

export default InfoSlice.reducer;
