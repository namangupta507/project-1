
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const OnboardingMembersListSlice = createSlice({
    name: "onboardingMembersList",
    initialState,
    reducers: {
        getOnboardingMembersListRequest(state) {
            state.loading = true;
        },
        getOnboardingMembersListRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getOnboardingMembersListRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getOnboardingMembersListRequest,
    getOnboardingMembersListRequestSuccess,
    getOnboardingMembersListRequestError,
} = OnboardingMembersListSlice.actions;

export default OnboardingMembersListSlice.reducer;
