
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const TeamsTreeSlice = createSlice({
    name: "teamsTree",
    initialState,
    reducers: {
        getTeamsTreeRequest(state) {
            state.loading = true;
        },
        getTeamsTreeRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getTeamsTreeRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getTeamsTreeRequest,
    getTeamsTreeRequestSuccess,
    getTeamsTreeRequestError,
} = TeamsTreeSlice.actions;

export default TeamsTreeSlice.reducer;
