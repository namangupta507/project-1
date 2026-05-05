
import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { reimbursementGraphDataRequest, reimbursementGraphDataRequestError, reimbursementGraphDataRequestSuccess } from "../../../slices/teams/reimbursement/GetGraphDataSlice";

export const GetReimbursementGraphDataApi = () => async (dispatch) => {

    try {
        dispatch(reimbursementGraphDataRequest());
        axiosInstance({
            method: "GET",
            url: endpoints.reimbursementGraphData,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(reimbursementGraphDataRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(reimbursementGraphDataRequestError(_error));
            });
    } catch (error) { }
};
