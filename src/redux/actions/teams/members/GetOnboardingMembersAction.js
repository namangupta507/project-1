import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getOnboardingMembersListRequest, getOnboardingMembersListRequestError, getOnboardingMembersListRequestSuccess } from "../../../slices/teams/members/GetOnboardingMembersSlice";

export const GetOnboardingMembersListApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams(data).toString();

    const url = `${endpoints.onboardingMembers}?${queryParams}`;
    try {
        dispatch(getOnboardingMembersListRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getOnboardingMembersListRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getOnboardingMembersListRequestError(_error));
            });
    } catch (error) { }
};
