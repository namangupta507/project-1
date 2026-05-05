import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { updateLoginRequest, updateLoginRequestError, updateLoginRequestSuccess } from "../../slices/auth/UpdateLoginSlice";

export const UpdateLoginAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(updateLoginRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: endpoints.firstLogin,
                data: data
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(updateLoginRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(updateLoginRequestError(_error));
        }
    };
};
