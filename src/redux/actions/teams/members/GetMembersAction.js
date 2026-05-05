import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getMembersListRequest, getMembersListRequestError, getMembersListRequestSuccess } from "../../../slices/teams/members/GetMembersSlice";

export const GetMembersListApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams(data).toString();

    const url = `${endpoints.membersList}?${queryParams}`;
    try {
        dispatch(getMembersListRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getMembersListRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getMembersListRequestError(_error));
            });
    } catch (error) { }
};
