import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getContentRequest, getContentRequestError, getContentRequestSuccess } from "../../slices/auth/GetContentSlice";

export const GetContentApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams(data).toString();

    const url = `${endpoints.content}?${queryParams}`;
    try {
        dispatch(getContentRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getContentRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getContentRequestError(_error));
            });
    } catch (error) { }
};
