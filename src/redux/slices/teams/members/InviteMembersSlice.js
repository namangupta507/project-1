import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const InviteMembersSlice = createSlice({
    name: "inviteMembers",
    initialState,
    reducers: {
        inviteMembersRequest(state) {
            state.loading = true;
        },
        inviteMembersRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        inviteMembersRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        inviteMembersStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    inviteMembersRequest,
    inviteMembersRequestSuccess,
    inviteMembersRequestError,
    inviteMembersStateReset,
} = InviteMembersSlice.actions;

export default InviteMembersSlice.reducer;
