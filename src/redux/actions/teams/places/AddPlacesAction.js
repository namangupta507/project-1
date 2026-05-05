import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { addPlacesRequest, addPlacesRequestError, addPlacesRequestSuccess } from "../../../slices/teams/places/AddPlacesSlice";

export const AddPlacesAPI = (data) => {

    return async (dispatch) => {
        try {
            dispatch(addPlacesRequest());
            const response = await axiosInstance({
                method: "POST",
                url: endpoints.addPlaces,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addPlacesRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addPlacesRequestError(_error));
        }
    };
};
