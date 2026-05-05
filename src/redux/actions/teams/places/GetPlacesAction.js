
import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getPlacesListRequest, getPlacesListRequestError, getPlacesListRequestSuccess } from "../../../slices/teams/places/GetPlacesListSlice";

export const GetPlacessApi = (data) => async (dispatch) => {
    const queryParams = new URLSearchParams({ page: data.page, limit: data.limit, search: data.search }).toString();

    const url = `${endpoints.placesList}/${data.id}?${queryParams}`;
    try {
        dispatch(getPlacesListRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getPlacesListRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getPlacesListRequestError(_error));
            });
    } catch (error) { }
};
