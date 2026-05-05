import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { addRateRequest, addRateRequestError, addRateRequestSuccess } from "../../slices/mileage-rates/AddRateSlice";

export const AddRateAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(addRateRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.addRate,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addRateRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addRateRequestError(_error));
        }
    };
};
