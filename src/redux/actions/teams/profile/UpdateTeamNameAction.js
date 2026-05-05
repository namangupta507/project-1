import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { updateTeamNameRequest, updateTeamNameRequestError, updateTeamNameRequestSuccess } from "../../../slices/teams/profile/UpdateTeamNameSlice";

export const UpdateTeamNameApi = (data) => {

    const url = `${endpoints.updateTeamName}/${data.id}`
    return async (dispatch) => {
        try {
            dispatch(updateTeamNameRequest());
            const response = await axiosInstance({
                method: "PATCH",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(updateTeamNameRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(updateTeamNameRequestError(_error));
        }
    };
};
