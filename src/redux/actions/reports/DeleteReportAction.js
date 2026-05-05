import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { deleteReportRequest, deleteReportRequestError, deleteReportRequestSuccess } from "../../slices/reports/DeleteReportSlice";

export const DeleteReportAPI = (data) => {
    // const queryParams = new URLSearchParams({ type: data.type }).toString();

    const url = `${endpoints.deleteReport}/${data.id}`
    return async (dispatch) => {
        try {
            dispatch(deleteReportRequest());
            const response = await axiosInstance({
                method: "DELETE",
                url: url,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(deleteReportRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(deleteReportRequestError(_error));
        }
    };
};
