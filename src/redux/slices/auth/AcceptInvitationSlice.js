import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AcceptInvitationSlice = createSlice({
    name: "acceptInvitation",
    initialState,
    reducers: {
        acceptInvitationRequest(state) {
            state.loading = true;
        },
        acceptInvitationRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        acceptInvitationRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        acceptInvitationStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    acceptInvitationRequest,
    acceptInvitationRequestSuccess,
    acceptInvitationRequestError,
    acceptInvitationStateReset,
} = AcceptInvitationSlice.actions;

export default AcceptInvitationSlice.reducer;
