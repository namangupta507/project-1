import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { editVehicleRequest, editVehicleRequestSuccess, editVehicleRequestError } from "../../slices/vehicle/EditVehicleSlice";

export const EditVehicleAPI = (data) => {
    const url = `${endpoints.editVehicle}/${data.id}`;
    const dataToSend = {
        type: data.type,
        name: data.name,
        country: data.country,
        licensePlate: data.plateNumber
    }
    return async (dispatch) => {
        try {
            dispatch(editVehicleRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: url,
                data: dataToSend,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(editVehicleRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(editVehicleRequestError(_error));
        }
    };
};
