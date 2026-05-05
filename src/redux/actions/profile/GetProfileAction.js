import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getProfileRequest, getProfileRequestSuccess, getProfileRequestError } from "../../slices/profile/GetProfileSlice";

export const GetProfileApi = () => async (dispatch) => {
    try {
        dispatch(getProfileRequest());
        axiosInstance({
            method: "GET",
            url: endpoints.profile,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getProfileRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getProfileRequestError(_error));
            });
    } catch (error) { }
};
