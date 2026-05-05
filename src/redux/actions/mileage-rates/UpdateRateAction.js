import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { updateRateRequest, updateRateRequestError, updateRateRequestSuccess } from "../../slices/mileage-rates/UpdateRateSlice";

export const UpdateRateAPI = (data, id) => {
    return async (dispatch) => {
        try {
            dispatch(updateRateRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: `${endpoints.updateRate}/${id}`,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(updateRateRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(updateRateRequestError(_error));
        }
    };
};
