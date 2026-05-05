
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const ParentTeamsListSlice = createSlice({
    name: "parentTeamsList",
    initialState,
    reducers: {
        getParentTeamsRequest(state) {
            state.loading = true;
        },
        getParentTeamsRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getParentTeamsRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getParentTeamsRequest,
    getParentTeamsRequestSuccess,
    getParentTeamsRequestError,
} = ParentTeamsListSlice.actions;

export default ParentTeamsListSlice.reducer;
