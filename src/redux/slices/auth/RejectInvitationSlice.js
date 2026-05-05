import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const RejectInvitationSlice = createSlice({
    name: "rejectInvitation",
    initialState,
    reducers: {
        rejectInvitationRequest(state) {
            state.loading = true;
        },
        rejectInvitationRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        rejectInvitationRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        rejectInvitationStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    rejectInvitationRequest,
    rejectInvitationRequestSuccess,
    rejectInvitationRequestError,
    rejectInvitationStateReset,
} = RejectInvitationSlice.actions;

export default RejectInvitationSlice.reducer;
