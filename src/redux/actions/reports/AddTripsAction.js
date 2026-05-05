import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { addTripsToReportRequest, addTripsToReportRequestError, addTripsToReportRequestSuccess } from "../../slices/reports/AddTripsSlice";

export const AddTripsToReportAPI = (data, data2) => {
    const url = `${endpoints.tripsToReport}/${data2.id}`;
    return async (dispatch) => {
        try {
            dispatch(addTripsToReportRequest());
            const response = await axiosInstance({
                method: "POST",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addTripsToReportRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addTripsToReportRequestError(_error));
        }
    };
};
