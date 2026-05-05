
import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getSummaryRequest, getSummaryRequestError, getSummaryRequestSuccess } from "../../../slices/teams/summary/GetSummarySlice";

export const GetSummaryApi = (data) => async (dispatch) => {

    const queryParams = new URLSearchParams({ page: data.page, limit: data.limit }).toString();

    const url = `${endpoints.getSummary}/${data.id}?${queryParams}`;
    try {
        dispatch(getSummaryRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getSummaryRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getSummaryRequestError(_error));
            });
    } catch (error) { }
};
