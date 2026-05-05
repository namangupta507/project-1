import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { addNewTeamRequest, addNewTeamRequestError, addNewTeamRequestSuccess } from "../../slices/teams/AddNewTeamSlice";

export const AddNewTeamAPI = (data) => {
    return async (dispatch) => {
        try {
            dispatch(addNewTeamRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.createTeam,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addNewTeamRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addNewTeamRequestError(_error));
        }
    };
};
