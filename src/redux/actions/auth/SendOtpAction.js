import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { sendOtpRequest, sendOtpRequestError, sendOtpRequestSuccess } from "../../slices/auth/SendOtpSlice";

export const SendOtpAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(sendOtpRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.sendOtp,
                data: data,
                headers: { "Content-Type": "application/json" },
            })
            return dispatch(sendOtpRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(sendOtpRequestError(_error));
        }
    };
};
