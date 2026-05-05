
import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { getCategoriesRequest, getCategoriesRequestError, getCategoriesRequestSuccess } from "../../../slices/teams/category/GetCategoryListSlice";

export const GetCategoryListApi = (data) => async (dispatch) => {
    console.log(data, "data")
    const queryParams = new URLSearchParams({ page: data.page, limit: data.limit, search: data.search }).toString();

    const url = `${endpoints.teamCategories}/${data.id}?${queryParams}`;
    try {
        dispatch(getCategoriesRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(getCategoriesRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(getCategoriesRequestError(_error));
            });
    } catch (error) { }
};
