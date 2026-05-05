import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getParentTeamsRequest, getParentTeamsRequestError, getParentTeamsRequestSuccess } from "../../slices/teams/GetParentTeamsSlice";

export const GetParentTeamsApi = (data) => async (dispatch) => {

    // console.log(data, "data")
    // const queryParams = new URLSearchParams({ isActive: data.isActive }).toString();

    // const url = `${endpoints.getVehicles}?${queryParams}`;
    // console.log(url)
    try {
        dispatch(getParentTeamsRequest());
        axiosInstance({
            method: "GET",
            url: endpoints.parentTeams,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getParentTeamsRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getParentTeamsRequestError(_error));
            });
    } catch (error) { }
};
