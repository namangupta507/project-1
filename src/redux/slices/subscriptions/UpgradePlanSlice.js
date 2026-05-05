import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const UpgradePlanSlice = createSlice({
    name: "upgradePlan",
    initialState,
    reducers: {
        upgradePlanRequest(state) {
            state.loading = true;
        },
        upgradePlanRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        upgradePlanRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        upgradePlanStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    upgradePlanRequest,
    upgradePlanRequestSuccess,
    upgradePlanRequestError,
    upgradePlanStateReset,
} = UpgradePlanSlice.actions;

export default UpgradePlanSlice.reducer;
