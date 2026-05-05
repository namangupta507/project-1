import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { loginRequest, loginRequestError, loginRequestSuccess } from "../../slices/auth/LoginSlice";

export const LoginAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(loginRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.login,
                data: data,
                headers: { "Content-Type": "application/json" },
            })
            return dispatch(loginRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(loginRequestError(_error));
        }
    };
};
