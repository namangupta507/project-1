import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getReportsRequest, getReportsRequestError, getReportsRequestSuccess } from "../../slices/reports/GetReportsSlice";

export const GetReportsApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams(data).toString();

    const url = `${endpoints.getReports}?${queryParams}`;
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
