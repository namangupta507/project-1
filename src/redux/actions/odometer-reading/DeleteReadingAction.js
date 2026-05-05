import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { deleteReadingRequest, deleteReadingRequestError, deleteReadingRequestSuccess } from "../../slices/odometer-readings/DeleteReadingSlice";

export const DeleteReadingAPI = ({ id }) => {
    return async (dispatch) => {
        const url = `${endpoints.deleteReading}/${id}`
        try {
            dispatch(deleteReadingRequest());
            const response = await axiosInstance({
                method: "DELETE",
                url: url,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(deleteReadingRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(deleteReadingRequestError(_error));
        }
    };
};
