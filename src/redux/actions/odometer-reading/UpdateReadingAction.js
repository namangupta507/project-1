import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { updateReadingRequest, updateReadingRequestError, updateReadingRequestSuccess } from "../../slices/odometer-readings/UpdateReadingSlice";

export const UpdateReadingAPI = (data, id) => {
    console.log(id, "id")
    const url = `${endpoints.updateReading}/${id}`
    return async (dispatch) => {
        try {
            dispatch(updateReadingRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(updateReadingRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(updateReadingRequestError(_error));
        }
    };
};
