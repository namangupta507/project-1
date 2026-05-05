import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getReportsRequest, getReportsRequestError, getReportsRequestSuccess } from "../../../slices/teams/members/GetReportsSlice";

export const GetMemberReportsApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams({ page: data.page, limit: data.limit, type: data.type }).toString();

    const url = `${endpoints.memberReports}/${data.id}?${queryParams}`;
    try {
        dispatch(getReportsRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getReportsRequestSuccess({ data: resp?.data, type: data.type }));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getReportsRequestError(_error));
            });
    } catch (error) { }
};
