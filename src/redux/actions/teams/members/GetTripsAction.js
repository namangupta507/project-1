import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getTripsRequest, getTripsRequestError, getTripsRequestSuccess } from "../../../slices/teams/members/GetTripsSlice";

export const GetMemberTripsApi = (data) => async (dispatch) => {

    const queryParams = new URLSearchParams({ page: data.page, limit: data.limit }).toString();

    const url = `${endpoints.memberTrips}/${data.id}?${queryParams}`;
    try {
        dispatch(getTripsRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getTripsRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getTripsRequestError(_error));
            });
    } catch (error) { }
};
