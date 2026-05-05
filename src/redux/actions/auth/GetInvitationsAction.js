import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { checkInvitationsRequest, checkInvitationsRequestError, checkInvitationsRequestSuccess } from "../../slices/auth/GetInvitationsSlice";

export const GetInvitationsApi = (data) => async (dispatch) => {
    try {
        dispatch(checkInvitationsRequest());
        axiosInstance({
            method: "GET",
            url: endpoints.checkInvitation,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(checkInvitationsRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(checkInvitationsRequestError(_error));
            });
    } catch (error) { }
};
