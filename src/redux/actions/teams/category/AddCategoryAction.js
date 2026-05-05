import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { addCategoryRequest, addCategoryRequestError, addCategoryRequestSuccess } from "../../../slices/teams/category/AddCategorySlice";

export const AddCategoryAPI = (data, data2) => {

    const url = `${endpoints.addCategory}/${data2.id}`
    return async (dispatch) => {
        try {
            dispatch(addCategoryRequest());
            const response = await axiosInstance({
                method: "POST",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(addCategoryRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(addCategoryRequestError(_error));
        }
    };
};
