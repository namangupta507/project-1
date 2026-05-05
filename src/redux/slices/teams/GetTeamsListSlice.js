
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const TeamsListSlice = createSlice({
    name: "teamsList",
    initialState,
    reducers: {
        getTeamsListRequest(state) {
            state.loading = true;
        },
        getTeamsListRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getTeamsListRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getTeamsListRequest,
    getTeamsListRequestSuccess,
    getTeamsListRequestError,
} = TeamsListSlice.actions;

export default TeamsListSlice.reducer;
