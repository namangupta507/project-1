import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { updateNotificationRequest, updateNotificationRequestError, updateNotificationRequestSuccess } from "../../slices/auth/UpdateNotificationSlice";

export const UpdateNotificationPreferenceAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(updateNotificationRequest());
            const response = await axiosInstance({
                method: "PATCH",
                url: endpoints.updateNotification,
                data: data
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(updateNotificationRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(updateNotificationRequestError(_error));
        }
    };
};
