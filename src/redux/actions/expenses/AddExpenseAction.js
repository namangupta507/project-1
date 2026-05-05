import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { addExpenseRequest, addExpenseRequestError, addExpenseRequestSuccess } from "../../slices/expenses/AddExpenseSlice";

export const AddExpenseAPI = (data) => {

    const queryParams = new URLSearchParams(data).toString();

    const url = `${endpoints.addExpense}?${queryParams}`;

    return async (dispatch) => {
        try {
            dispatch(addExpenseRequest());
            const response = await axiosInstance({
                method: "POST",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addExpenseRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addExpenseRequestError(_error));
        }
    };
};
