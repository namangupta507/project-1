import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { submitReportRequest, submitReportRequestError, submitReportRequestSuccess } from "../../slices/reports/SubmitReportSlice";

export const SubmitReportAPI = (data, data2) => {
    const url = `${endpoints.submitReport}/${data2.id}`;
    return async (dispatch) => {
        try {
            dispatch(submitReportRequest());
            const response = await axiosInstance({
                method: "PATCH",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(submitReportRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(submitReportRequestError(_error));
        }
    };
};
