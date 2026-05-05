import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { updateReadingRequestSuccess } from "../../slices/odometer-readings/UpdateReadingSlice";
import { UpdateReportRequest, UpdateReportRequestError } from "../../slices/reports/UpdateReportSlice";

export const UpdateReportAPI = (data) => {
    const queryParams = new URLSearchParams({ type: data.type, name: data.name }).toString();

    const url = `${endpoints.updateReport}/${data.id}?${queryParams}`
    return async (dispatch) => {
        try {
            dispatch(UpdateReportRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(updateReadingRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(UpdateReportRequestError(_error));
        }
    };
};
