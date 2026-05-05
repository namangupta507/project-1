import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { changePasswordRequest, changePasswordRequestError, changePasswordRequestSuccess } from "../../slices/auth/ChangePasswordSlice";

export const ChangePasswordAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(changePasswordRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.changePassword,
                data: data,
                headers: { "Content-Type": "application/json" },
            })
            return dispatch(changePasswordRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(changePasswordRequestError(_error));
        }
    };
};
