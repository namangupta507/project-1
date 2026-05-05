import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { uploadMultipleRequest, uploadMultipleRequestError, uploadMultipleRequestSuccess } from "../../../slices/teams/category/UploadMultipleSlice";

export const UploadMultipleAPI = (data, id) => {
    return async (dispatch) => {
        const url = `${endpoints.categoriesUploadMultiple}/${id}`
        try {
            dispatch(uploadMultipleRequest());
            const response = await axiosInstance({
                method: "POST",
                url: url,
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            })
            return dispatch(uploadMultipleRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(uploadMultipleRequestError(_error));
        }
    };
};
