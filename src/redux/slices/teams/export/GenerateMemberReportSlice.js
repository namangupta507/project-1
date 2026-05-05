import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const GenerateMemberReportSlice = createSlice({
    name: "generateMemberReport",
    initialState,
    reducers: {
        generateMemberReportRequest(state) {
            state.loading = true;
        },
        generateMemberReportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        generateMemberReportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        generateMemberReportStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    generateMemberReportRequest,
    generateMemberReportRequestSuccess,
    generateMemberReportRequestError,
    generateMemberReportStateReset,
} = GenerateMemberReportSlice.actions;

export default GenerateMemberReportSlice.reducer;
