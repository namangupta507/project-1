import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { updateProfileRequest, updateProfileRequestError, updateProfileRequestSuccess } from "../../slices/auth/UpdateProfileSlice";

export const UpdateProfileAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(updateProfileRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: endpoints.updateProfile,
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            })
            return dispatch(updateProfileRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(updateProfileRequestError(_error));
        }
    };
};
