import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getTripsRequest, getTripsRequestError, getTripsRequestSuccess } from "../../slices/trips/GetTripsSlice";

export const GetTripsApi = (data) => async (dispatch) => {

    const params = {};

    if (data.month) params.month = data.month;
    if (data.year) params.year = data.year;
    if (data.category) params.category = data.category;
    if (data.search) params.search = data.search;
    if (data.vehicleFilter) params.vehicle = data.vehicleFilter;

    const queryParams = new URLSearchParams(params).toString();

    const url = `${endpoints.getTrips}?${queryParams}`;
    try {
        dispatch(getTripsRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getTripsRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getTripsRequestError(_error));
            });
    } catch (error) { }
};
