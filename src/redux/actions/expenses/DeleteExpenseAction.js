import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { deleteExpenseRequest, deleteExpenseRequestError, deleteExpenseRequestSuccess } from "../../slices/expenses/DeleteExpenseSlice";

export const DeleteExpenseAPI = ({ id }) => {

    const url = `${endpoints.deleteExpenses}/${id}`;

    return async (dispatch) => {
        try {
            dispatch(deleteExpenseRequest());
            const response = await axiosInstance({
                method: "DELETE",
                url: url,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(deleteExpenseRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(deleteExpenseRequestError(_error));
        }
    };
};
