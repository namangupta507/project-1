import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { generateXlsReportRequest, generateXlsReportRequestError, generateXlsReportRequestSuccess } from "../../slices/reports/GenerateXlsReportSlice";

export const GenerateXlsReportAPI = (data) => {
    const queryParams = new URLSearchParams({ type: data.type }).toString()
    const url = `${endpoints.xlsReport}/${data.id}?${queryParams}`
    return async (dispatch) => {
        try {
            dispatch(generateXlsReportRequest());
            const response = await axiosInstance({
                method: "GET",
                url: url,
                data: data,
                responseType: 'blob'
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(generateXlsReportRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(generateXlsReportRequestError(_error));
        }
    };
};
