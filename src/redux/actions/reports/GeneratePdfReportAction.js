import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { generatePdfReportRequest, generatePdfReportRequestError, generatePdfReportRequestSuccess } from "../../slices/reports/GeneratePdfReportSlice";

export const GeneratePdfReportAPI = (data) => {
    const queryParams = new URLSearchParams({ type: data.type }).toString()
    const url = `${endpoints.pdfReport}/${data.id}?${queryParams}`
    return async (dispatch) => {
        try {
            dispatch(generatePdfReportRequest());
            const response = await axiosInstance({
                method: "POST",
                url: url,
                data: data,
                responseType: "blob",
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(generatePdfReportRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(generatePdfReportRequestError(_error));
        }
    };
};
