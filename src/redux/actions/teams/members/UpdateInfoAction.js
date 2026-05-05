import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { updateInfoRequest, updateInfoRequestError, updateInfoRequestSuccess } from "../../../slices/teams/members/UpdateInfoSlice";

export const UpdateInfoAPI = (data, data2) => {
    const url = `${endpoints.updateInfo}/${data2.userId}`
    return async (dispatch) => {
        try {
            dispatch(updateInfoRequest());
            const response = await axiosInstance({
                method: "PUT",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(updateInfoRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(updateInfoRequestError(_error));
        }
    };
};
