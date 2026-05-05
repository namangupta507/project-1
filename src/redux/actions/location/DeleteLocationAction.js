import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { deleteLocationRequest, deleteLocationRequestError, deleteLocationRequestSuccess } from "../../slices/location/DeleteLocationSlice";

export const DeleteLocationAPI = (data) => {
    const url = `${endpoints.deleteLocation}/${data.id}`;

    return async (dispatch) => {
        try {
            dispatch(deleteLocationRequest());
            const response = await axiosInstance({
                method: "DELETE",
                url: url,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(deleteLocationRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(deleteLocationRequestError(_error));
        }
    };
};
