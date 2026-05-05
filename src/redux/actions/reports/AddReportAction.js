import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { addReportRequest, addReportRequestError, addReportRequestSuccess } from "../../slices/reports/AddReportSlice";

export const AddReportAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(addReportRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.addReport,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addReportRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addReportRequestError(_error));
        }
    };
};
