import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { inviteMembersRequest, inviteMembersRequestError, inviteMembersRequestSuccess } from "../../../slices/teams/members/InviteMembersSlice";

export const InviteMembersAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(inviteMembersRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.inviteMembers,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(inviteMembersRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(inviteMembersRequestError(_error));
        }
    };
};
