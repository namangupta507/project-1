import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getReportDetailRequest, getReportDetailRequestError, getReportDetailRequestSuccess } from "../../slices/reports/GetReportDetailSlice";

export const GetReportDetailApi = (data) => async (dispatch) => {
    // const queryParams = new URLSearchParams({ type: data.type }).toString();

    const url = `${endpoints.reportDetail}/${data.id}`;
    try {
        dispatch(getReportDetailRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getReportDetailRequestSuccess({ data: resp?.data, type: data.type }));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getReportDetailRequestError(_error));
            });
    } catch (error) { }
};
