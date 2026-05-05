import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getExportRequest, getExportRequestError, getExportRequestSuccess } from "../../../slices/teams/export/GetExportSlice";

export const GetExportsApi = (data) => async (dispatch) => {
    console.log(data, "data")
    const queryParams = new URLSearchParams({ page: data.page, limit: data.limit }).toString();

    const url = `${endpoints.exports}/${data.id}?${queryParams}`;
    try {
        dispatch(getExportRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getExportRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getExportRequestError(_error));
            });
    } catch (error) { }
};
