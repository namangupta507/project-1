import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const SocialLoginSlice = createSlice({
    name: "socialLoginRequest",
    initialState,
    reducers: {
        socialLoginRequest(state) {
            state.loading = true;
        },
        socialLoginRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        socialLoginRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        socialLoginStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    socialLoginRequest,
    socialLoginRequestSuccess,
    socialLoginRequestError,
    socialLoginStateReset,
} = SocialLoginSlice.actions;

export default SocialLoginSlice.reducer;
