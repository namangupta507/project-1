
import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { reimbursementListRequest, reimbursementListRequestError, reimbursementListRequestSuccess } from "../../../slices/teams/reimbursement/GetListSlice";

export const GetReimbursementListApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams({ page: data.page, limit: data.limit, type: data.type, teamId: data.teamId, month: data.month, year: data.year }).toString();
    const url = `${endpoints.reimbursementList}?${queryParams}`;
    try {
        dispatch(reimbursementListRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(reimbursementListRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(reimbursementListRequestError(_error));
            });
    } catch (error) { }
};
