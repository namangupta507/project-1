import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getTeamMembersRequest, getTeamMembersRequestError, getTeamMembersRequestSuccess } from "../../slices/teams/GetTeamMembersSlice";

export const GetTeamMembersApi = (data) => async (dispatch) => {
    // const queryParams = new URLSearchParams(data).toString();

    // const url = `${endpoints.teamsList}?${queryParams}`;
    try {
        dispatch(getTeamMembersRequest());
        axiosInstance({
            method: "GET",
            url: endpoints.teamMembers,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getTeamMembersRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getTeamMembersRequestError(_error));
            });
    } catch (error) { }
};
