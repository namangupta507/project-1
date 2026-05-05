import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { resetPasswordRequest, resetPasswordRequestError, resetPasswordRequestSuccess } from "../../slices/auth/ResetPasswordSlice";

export const ResetPasswordAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(resetPasswordRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.resetPassword,
                data: data,
                headers: { "Content-Type": "application/json" },
            })
            return dispatch(resetPasswordRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(resetPasswordRequestError(_error));
        }
    };
};
