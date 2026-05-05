import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const UpdateNotificationSlice = createSlice({
    name: "updateNotification",
    initialState,
    reducers: {
        updateNotificationRequest(state) {
            state.loading = true;
        },
        updateNotificationRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        updateNotificationRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        updateNotificationStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    updateNotificationRequest,
    updateNotificationRequestSuccess,
    updateNotificationRequestError,
    updateNotificationStateReset,
} = UpdateNotificationSlice.actions;

export default UpdateNotificationSlice.reducer;
