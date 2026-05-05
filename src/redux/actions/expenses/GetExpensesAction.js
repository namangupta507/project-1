import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getExpensesRequest, getExpensesRequestError, getExpensesRequestSuccess } from "../../slices/expenses/GetExpensesSlice";

export const GetExpensesApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams(data).toString();

    const url = `${endpoints.getExpenses}?${queryParams}`;
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
