import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { editExpenseRequest, editExpenseRequestError, editExpenseRequestSuccess } from "../../slices/expenses/EditExpenseSlice";

export const EditExpenseAPI = (id, data) => {
    return async (dispatch) => {
        try {
            dispatch(editExpenseRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: `${endpoints.editExpense}/${id}`,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(editExpenseRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(editExpenseRequestError(_error));
        }
    };
};
