import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const UpdateTeamNameSlice = createSlice({
    name: "updateTeamName",
    initialState,
    reducers: {
        updateTeamNameRequest(state) {
            state.loading = true;
        },
        updateTeamNameRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        updateTeamNameRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        updateTeamNameStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    updateTeamNameRequest,
    updateTeamNameRequestSuccess,
    updateTeamNameRequestError,
    updateTeamNameStateReset,
} = UpdateTeamNameSlice.actions;

export default UpdateTeamNameSlice.reducer;
