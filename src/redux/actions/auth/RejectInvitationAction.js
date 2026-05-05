import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { rejectInvitationRequest, rejectInvitationRequestError, rejectInvitationRequestSuccess } from "../../slices/auth/RejectInvitationSlice";

export const RejectInvitationAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(rejectInvitationRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: endpoints.rejectInvitation,
                data: data
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(rejectInvitationRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(rejectInvitationRequestError(_error));
        }
    };
};
