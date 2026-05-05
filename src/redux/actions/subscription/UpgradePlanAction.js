import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { upgradePlanRequest, upgradePlanRequestError, upgradePlanRequestSuccess } from "../../slices/subscriptions/UpgradePlanSlice";

export const UpgradePlanAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(upgradePlanRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.upgradePlan,
                data: data,
            })
            return dispatch(upgradePlanRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(upgradePlanRequestError(_error));
        }
    };
};
