import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { subscriptionSuccessRequest, subscriptionSuccessRequestError, subscriptionSuccessRequestSuccess } from "../../slices/auth/SubscriptionSuccessSlice";

export const SubscriptionSuccessAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(subscriptionSuccessRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.subscriptionSuccess,
                data: data,
                headers: { "Content-Type": "application/json" },
            })
            return dispatch(subscriptionSuccessRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(subscriptionSuccessRequestError(_error));
        }
    };
};
