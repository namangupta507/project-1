import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getTeamsTreeRequest, getTeamsTreeRequestError, getTeamsTreeRequestSuccess } from "../../slices/teams/GetTeamsTreeSlice";

export const GetTeamsTreeApi = (data) => async (dispatch) => {

    // console.log(data, "data")
    // const queryParams = new URLSearchParams({ isActive: data.isActive }).toString();

    // const url = `${endpoints.getVehicles}?${queryParams}`;
    // console.log(url)
    try {
        dispatch(getTeamsTreeRequest());
        axiosInstance({
            method: "GET",
            url: endpoints.teamsTree,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getTeamsTreeRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getTeamsTreeRequestError(_error));
            });
    } catch (error) { }
};
