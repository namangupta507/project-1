import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { socialLoginRequest, socialLoginRequestError, socialLoginRequestSuccess } from "../../slices/auth/SocialLoginSlice";

export const SocialLoginAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(socialLoginRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.socialLogin,
                data: data,
                headers: { "Content-Type": "application/json" },
            })
            return dispatch(socialLoginRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(socialLoginRequestError(_error));
        }
    };
};
