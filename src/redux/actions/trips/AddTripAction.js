import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { addTripRequest, addTripRequestError, addTripRequestSuccess } from "../../slices/trips/AddTripSlice";

export const AddTripAPI = (data) => {
    console.log("reached")
    return async (dispatch) => {
        try {
            dispatch(addTripRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.addTrip,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addTripRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addTripRequestError(_error));
        }
    };
};
