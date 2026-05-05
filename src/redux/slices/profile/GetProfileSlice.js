import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const ProfileDataSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        getProfileRequest(state) {
            state.loading = true;
        },
        getProfileRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getProfileRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getProfileRequest,
    getProfileRequestSuccess,
    getProfileRequestError,
} = ProfileDataSlice.actions;

export default ProfileDataSlice.reducer;
