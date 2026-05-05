import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { generateSummaryReportRequest, generateSummaryReportRequestError, generateSummaryReportRequestSuccess } from "../../../slices/teams/export/GenerateSummaryReportSlice";

export const GenerateSummaryReportAPI = (data) => {

    const url = `${endpoints.summaryReport}`
    return async (dispatch) => {
        try {
            dispatch(generateSummaryReportRequest());
            const response = await axiosInstance({
                method: "POST",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(generateSummaryReportRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(generateSummaryReportRequestError(_error));
        }
    };
};
