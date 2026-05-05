import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { updateReadingRequestSuccess } from "../../slices/odometer-readings/UpdateReadingSlice";
import { renameReportRequest, renameReportRequestError, renameReportRequestSuccess } from "../../slices/reports/RenamReportSlice";

export const RenameReportAPI = (data, data2) => {
    // const queryParams = new URLSearchParams({ type: data.type, name: data.name }).toString();

    const url = `${endpoints.renameReport}/${data2.id}`
    return async (dispatch) => {
        try {
            dispatch(renameReportRequest());
            const response = await axiosInstance({
                method: "PATCH",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(renameReportRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(renameReportRequestError(_error));
        }
    };
};
