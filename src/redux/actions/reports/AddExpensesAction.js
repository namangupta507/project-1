import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { addExpenseToReportsRequest, addExpenseToReportsRequestError, addExpenseToReportsRequestSuccess } from "../../slices/reports/AddExpensesSlice";

export const AddExpensesToReportAPI = (data, data2) => {
    const url = `${endpoints.expensesToReport}/${data2.id}`;
    return async (dispatch) => {
        try {
            dispatch(addExpenseToReportsRequest());
            const response = await axiosInstance({
                method: "POST",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addExpenseToReportsRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addExpenseToReportsRequestError(_error));
        }
    };
};
