import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { addReadingRequest, addReadingRequestError, addReadingRequestSuccess } from "../../slices/odometer-readings/AddReadingSlice";

export const AddReadingAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(addReadingRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.addReading,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addReadingRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addReadingRequestError(_error));
        }
    };
};
