import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { getCustomRatesRequest, getCustomRatesRequestError, getCustomRatesRequestSuccess } from "../../slices/mileage-rates/GetCustomRatesSlice";

export const GetCustomRatesApi = () => async (dispatch) => {

    try {
        dispatch(getCustomRatesRequest());
        axiosInstance({
            method: "GET",
            url: endpoints.customRates,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getCustomRatesRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getCustomRatesRequestError(_error));
            });
    } catch (error) { }
};
