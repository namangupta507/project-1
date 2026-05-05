import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { editTripRequest, editTripRequestError, editTripRequestSuccess } from "../../slices/trips/EditTripSlice";

export const EditTripAPI = (id, data) => {
    console.log('reached')
    return async (dispatch) => {
        try {
            dispatch(editTripRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: `${endpoints.updateTrip}/${id}`,
                data: data
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(editTripRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(editTripRequestError(_error));
        }
    };
};
