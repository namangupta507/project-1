import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getMembersDropdownRequest, getMembersDropdownRequestError, getMembersDropdownRequestSuccess } from "../../../slices/teams/members/GetDropdownSlice";

export const GetMembersDropdownApi = (data) => async (dispatch) => {
    try {
        dispatch(getMembersDropdownRequest());
        axiosInstance({
            method: "GET",
            url: endpoints.membersDropdown,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getMembersDropdownRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getMembersDropdownRequestError(_error));
            });
    } catch (error) { }
};
