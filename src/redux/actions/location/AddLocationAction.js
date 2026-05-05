import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { addLocationRequest, addLocationRequestError, addLocationRequestSuccess } from "../../slices/location/AddLocationSlice";

export const AddLocationAPI = (data) => {

    return async (dispatch) => {
        try {
            dispatch(addLocationRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.addLocation,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addLocationRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addLocationRequestError(_error));
        }
    };
};
