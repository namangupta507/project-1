import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const MembersDropdownSlice = createSlice({
    name: "members-dropwdown",
    initialState,
    reducers: {
        getMembersDropdownRequest(state) {
            state.loading = true;
        },
        getMembersDropdownRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getMembersDropdownRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getMembersDropdownRequest,
    getMembersDropdownRequestSuccess,
    getMembersDropdownRequestError,
} = MembersDropdownSlice.actions;

export default MembersDropdownSlice.reducer;
