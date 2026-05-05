import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const UpdateProfileSlice = createSlice({
    name: "updateProfile",
    initialState,
    reducers: {
        updateProfileRequest(state) {
            state.loading = true;
        },
        updateProfileRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        updateProfileRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        updateProfileStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    updateProfileRequest,
    updateProfileRequestSuccess,
    updateProfileRequestError,
    updateProfileStateReset,
} = UpdateProfileSlice.actions;

export default UpdateProfileSlice.reducer;
