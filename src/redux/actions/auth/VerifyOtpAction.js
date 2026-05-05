import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { verifyOtpRequest, verifyOtpRequestError, verifyOtpRequestSuccess } from "../../slices/auth/VerifyOtpSlice";

export const VerifyOtpAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(verifyOtpRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.verifyOtp,
                data: data,
                headers: { "Content-Type": "application/json" },
            })
            return dispatch(verifyOtpRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(verifyOtpRequestError(_error));
        }
    };
};
