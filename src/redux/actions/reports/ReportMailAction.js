import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { reportMailRequest, reportMailRequestError, reportMailRequestSuccess } from "../../slices/reports/ReportMailSlice";

export const SendReportMailAPI = (data) => {
    const queryParams = new URLSearchParams({ type: data.type }).toString();
    const url = `${endpoints.reportMail}/${data.id}?${queryParams}`
    return async (dispatch) => {
        try {
            dispatch(reportMailRequest());
            const response = await axiosInstance({
                method: "GET",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(reportMailRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(reportMailRequestError(_error));
        }
    };
};
