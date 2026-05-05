
import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getListRequest, getListRequestError, getListRequestSuccess } from "../../../slices/teams/roleAndPermissions/GetListSlice";

export const GetRolesListApi = (data) => async (dispatch) => {
    // const queryParams = new URLSearchParams(data).toString();

    const url = `${endpoints.rolesList}/6899f4870aa1a33aab91d15f`;
    try {
        dispatch(getListRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getListRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getListRequestError(_error));
            });
    } catch (error) { }
};
