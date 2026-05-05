import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { addVehicleRequest, addVehicleRequestError, addVehicleRequestSuccess } from "../../slices/vehicle/AddVehicleSlice";

export const AddVehicleAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(addVehicleRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.addVehicle,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addVehicleRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addVehicleRequestError(_error));
        }
    };
};
