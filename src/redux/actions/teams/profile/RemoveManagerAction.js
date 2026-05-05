import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { removeManagerRequest, removeManagerRequestError, removeManagerRequestSuccess } from "../../../slices/teams/profile/RemoveManagerSlice";

export const RemoveManagerApi = (data) => {

    const url = `${endpoints.removeManager}`
    return async (dispatch) => {
        try {
            dispatch(removeManagerRequest());
            const response = await axiosInstance({
                method: "POST",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(removeManagerRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(removeManagerRequestError(_error));
        }
    };
};
