import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getTeamsListRequest, getTeamsListRequestError, getTeamsListRequestSuccess } from "../../slices/teams/GetTeamsListSlice";

export const GetTeamsListApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams(data).toString();

    const url = `${endpoints.teamsList}?${queryParams}`;
    try {
        dispatch(getTeamsListRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getTeamsListRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getTeamsListRequestError(_error));
            });
    } catch (error) { }
};
