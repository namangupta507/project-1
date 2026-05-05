import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { deleteTripRequest, deleteTripRequestError, deleteTripRequestSuccess } from "../../slices/trips/DeleteTripSlice";

export const DeleteTripAPI = ({ id }) => {

    const url = `${endpoints.deleteTrip}/${id}`;

    return async (dispatch) => {
        try {
            dispatch(deleteTripRequest());
            const response = await axiosInstance({
                method: "DELETE",
                url: url,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(deleteTripRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(deleteTripRequestError(_error));
        }
    };
};
