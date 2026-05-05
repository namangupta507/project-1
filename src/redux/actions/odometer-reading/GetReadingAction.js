import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getReadingRequest, getReadingRequestError, getReadingRequestSuccess } from "../../slices/odometer-readings/GetReadingSlice";

export const GetReadingsApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams({ vechicleId: data.vehicleId }).toString();

    const url = `${endpoints.getReading}?${queryParams}`;
    try {
        dispatch(getReadingRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getReadingRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getReadingRequestError(_error));
            });
    } catch (error) { }
};
