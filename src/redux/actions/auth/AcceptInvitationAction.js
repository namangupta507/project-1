import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { acceptInvitationRequest, acceptInvitationRequestError, acceptInvitationRequestSuccess } from "../../slices/auth/AcceptInvitationSlice";

export const AcceptInvitationAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(acceptInvitationRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: endpoints.acceptInvitation,
                data: data
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(acceptInvitationRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(acceptInvitationRequestError(_error));
        }
    };
};
