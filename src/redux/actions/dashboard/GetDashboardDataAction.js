import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getDashboardDataRequest, getDashboardDataRequestError, getDashboardDataRequestSuccess } from "../../slices/dashboard/GetDashboardDataSlice";

export const GetDashboardDataApi = (data) => async (dispatch) => {
    const url = `${endpoints.dashboardData}/${data}?type=both`;
    try {
        dispatch(getDashboardDataRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getDashboardDataRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getDashboardDataRequestError(_error));
            });
    } catch (error) { }
};
