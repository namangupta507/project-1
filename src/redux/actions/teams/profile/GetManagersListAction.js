import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getManagersListRequest, getManagersListRequestError, getManagersListRequestSuccess } from "../../../slices/teams/profile/GetManagersSlice";

export const GetManagersListApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams({ page: data.page, limit: data.limit }).toString();

    const url = `${endpoints.managersList}/${data.id}?${queryParams}`;
    try {
        dispatch(getManagersListRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getManagersListRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getManagersListRequestError(_error));
            });
    } catch (error) { }
};
