import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getLocationsRequest, getLocationsRequestError, getLocationsRequestSuccess } from "../../slices/location/GetLocationsSlice";

export const GetLocationsApi = () => async (dispatch) => {
    try {
        dispatch(getLocationsRequest());
        axiosInstance({
            method: "GET",
            url: endpoints.getLocations,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getLocationsRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getLocationsRequestError(_error));
            });
    } catch (error) { }
};
