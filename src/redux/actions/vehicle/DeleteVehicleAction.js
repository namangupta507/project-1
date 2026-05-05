import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { deleteVehicleRequest, deleteVehicleRequestError, deleteVehicleRequestSuccess } from "../../slices/vehicle/DeleteVehicleSlice";

export const DeleteVehicleAPI = (data) => {
    console.log(data, "id")
    const url = `${endpoints.deleteVehicle}/${data.id}`;

    return async (dispatch) => {
        try {
            dispatch(deleteVehicleRequest());
            const response = await axiosInstance({
                method: "DELETE",
                url: url,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(deleteVehicleRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(deleteVehicleRequestError(_error));
        }
    };
};
