
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const MembersListSlice = createSlice({
    name: "membersList",
    initialState,
    reducers: {
        getMembersListRequest(state) {
            state.loading = true;
        },
        getMembersListRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getMembersListRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getMembersListRequest,
    getMembersListRequestSuccess,
    getMembersListRequestError,
} = MembersListSlice.actions;

export default MembersListSlice.reducer;
