import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { infoRequest, infoRequestError, infoRequestSuccess } from "../../../slices/teams/members/GetInfoSlice";

export const GetMemberInfoApi = (data) => async (dispatch) => {

    const url = `${endpoints.memberInfo}/${data.id}`;
    try {
        dispatch(infoRequest());
        axiosInstance({
            method: "GET",
            url: url,
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => {
                return dispatch(infoRequestSuccess(resp?.data));
            })
            .catch((error) => {
                const _error = {
                    data: error?.response?.data?.message || error?.message,
                    status: error?.response?.status || error?.status,
                };
                return dispatch(infoRequestError(_error));
            });
    } catch (error) { }
};
