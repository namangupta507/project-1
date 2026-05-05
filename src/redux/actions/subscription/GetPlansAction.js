import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { plansRequest, plansRequestError, plansRequestSuccess } from "../../slices/subscriptions/GetPlansSlice";

export const GetPlansApi = (id) => async (dispatch) => {

    console.log(id, "idddddd")
    const url = `${endpoints.subscriptionPlans}/${id}`
    try {
        dispatch(plansRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(plansRequestSuccess({ data: resp?.data }));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(plansRequestError(_error));
            });
    } catch (error) { }
};
