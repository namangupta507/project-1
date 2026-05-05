import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddNewTeamSlice = createSlice({
    name: "addNewTeam",
    initialState,
    reducers: {
        addNewTeamRequest(state) {
            state.loading = true;
        },
        addNewTeamRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addNewTeamRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addNewTeamStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addNewTeamRequest,
    addNewTeamRequestSuccess,
    addNewTeamRequestError,
    addNewTeamStateReset,
} = AddNewTeamSlice.actions;

export default AddNewTeamSlice.reducer;
