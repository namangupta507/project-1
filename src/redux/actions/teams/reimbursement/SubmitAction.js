
import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { submitRequest, submitRequestError, submitRequestSuccess } from "../../../slices/teams/reimbursement/SubmitSlice";

export const SubmitReimbursementAPI = (data, data2) => {
    const url = `${endpoints.reimbursementSubmit}/${data2.id}`;
    return async (dispatch) => {
        try {
            dispatch(submitRequest());
            const response = await axiosInstance({
                method: "PATCH",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(submitRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(submitRequestError(_error));
        }
    };
};
