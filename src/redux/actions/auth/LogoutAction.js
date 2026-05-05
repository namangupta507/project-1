import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { logoutRequest, logoutRequestSuccess, logoutRequestError } from "../../slices/auth/LogoutSlice";

export const LogoutApi = (data) => {

    return async (dispatch) => {
        try {
            dispatch(logoutRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.logout,
                headers: { "Content-Type": "application/json" },
            })
            return dispatch(logoutRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(logoutRequestError(_error));
        }
    };
};
