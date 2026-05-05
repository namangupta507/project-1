import axiosInstance from "../../../../api/axiosInstance";
import { endpoints } from "../../../../services/endpoints";
import { generateMemberReportRequest, generateMemberReportRequestError, generateMemberReportRequestSuccess } from "../../../slices/teams/export/GenerateMemberReportSlice";

export const GenerateMemberReportAPI = (data) => {

    const url = `${endpoints.memberReport}`
    return async (dispatch) => {
        try {
            dispatch(generateMemberReportRequest());
            const response = await axiosInstance({
                method: "POST",
                url: url,
                data: data,
                // headers: { "Content-Type": "application/json" },
            })
            return dispatch(generateMemberReportRequestSuccess(response?.data));
        } catch (error) {
            const _error = {
                data: error?.response?.data?.message || error?.message,
                status: error?.response?.status || error?.status,
            };
            return dispatch(generateMemberReportRequestError(_error));
        }
    };
};
