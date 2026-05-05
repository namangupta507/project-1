import axiosInstance from "../../../api/axiosInstance";
import { endpoints } from "../../../services/endpoints";
import { editLocationRequest, editLocationRequestError, editLocationRequestSuccess } from "../../slices/location/EditLocationSlice";

export const EditLocationAPI = (data) => {
    const url = `${endpoints.editLocation}/${data.id}`;
    const dataToSend = {
        locationName: data.locationName,
        city: data.city,
        country: data.country,
        address: data.address,
        postcode: data.postcode,
        coordinates: data.coordinates
    }
    return async (dispatch) => {
        try {
            dispatch(editLocationRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: url,
                data: dataToSend,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(editLocationRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(editLocationRequestError(_error));
        }
    };
};
