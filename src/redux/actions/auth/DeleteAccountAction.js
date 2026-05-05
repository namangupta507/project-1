import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { deleteAccountRequest, deleteAccountRequestError, deleteAccountRequestSuccess } from "../../slices/auth/DeleteAccountSlice";

export const DeleteAccountAPI = () => {
    return async (dispatch) => {
        try {
            dispatch(deleteAccountRequest());
            const response = await axiosInstance({
                method: "DELETE",
                url: endpoints.deleteAccount,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(deleteAccountRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(deleteAccountRequestError(_error));
        }
    };
};
