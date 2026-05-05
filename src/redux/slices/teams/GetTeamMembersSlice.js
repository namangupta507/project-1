
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const TeamMembersListSlice = createSlice({
    name: "teamMembersList",
    initialState,
    reducers: {
        getTeamMembersRequest(state) {
            state.loading = true;
        },
        getTeamMembersRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getTeamMembersRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getTeamMembersRequest,
    getTeamMembersRequestSuccess,
    getTeamMembersRequestError,
} = TeamMembersListSlice.actions;

export default TeamMembersListSlice.reducer;
