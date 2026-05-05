import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getExpensesRequest, getExpensesRequestError, getExpensesRequestSuccess } from "../../../slices/teams/members/GetExpensesSlice";

export const GetMemberExpensesApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams({ page: data.page, limit: data.limit, type: data.type }).toString();

    const url = `${endpoints.memberExpenses}/${data.id}?${queryParams}`;
    try {
        dispatch(getExpensesRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getExpensesRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getExpensesRequestError(_error));
            });
    } catch (error) { }
};
