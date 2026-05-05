import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { registerRequest, registerRequestError, registerRequestSuccess } from "../../slices/auth/RegisterSlice";

export const RegisterAPI = ({ fullName, email, password }) => {
    const data = {
        fullName,
        email, password
    }
    return async (dispatch) => {
        try {
            dispatch(registerRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.register,
                data: data,
                headers: { "Content-Type": "application/json" },
            })
            return dispatch(registerRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(registerRequestError(_error));
        }
    };
};
