import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getVehiclesRequest, getVehiclesRequestError, getVehiclesRequestSuccess } from "../../slices/vehicle/GetVehiclesSlice";

export const GetVehiclesApi = (data) => async (dispatch) => {

    console.log(data, "data")
    const queryParams = new URLSearchParams({ isActive: data.isActive }).toString();

    const url = `${endpoints.getVehicles}?${queryParams}`;
    console.log(url)
    try {
        dispatch(getVehiclesRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getVehiclesRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getVehiclesRequestError(_error));
            });
    } catch (error) { }
};
