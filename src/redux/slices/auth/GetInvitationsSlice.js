
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const InvitationsSlice = createSlice({
    name: "invitations",
    initialState,
    reducers: {
        checkInvitationsRequest(state) {
            state.loading = true;
        },
        checkInvitationsRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        checkInvitationsRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    checkInvitationsRequest,
    checkInvitationsRequestSuccess,
    checkInvitationsRequestError,
} = InvitationsSlice.actions;

export default InvitationsSlice.reducer;
