import { ResponseRequest, ResponseResponse } from "@/lib/types/response-type"
import axiosInstance from "../axios"
import { RESPONSE_ENPOINTS } from "../endpoints"

export const responseService = {
    getall : async (query: string) => {
        const response = await axiosInstance.get(RESPONSE_ENPOINTS.GET_ALL_RESPONSES(query))
        return response.data
    },

    updateResponse: async (id: string,data: ResponseRequest): Promise<ResponseResponse> => {
        const response = await axiosInstance.put(RESPONSE_ENPOINTS.UPDATE_RESPONSE(id), data)
        return response.data
    },

    deleteResponse: async (id: string) => {
        const response = await axiosInstance.delete(RESPONSE_ENPOINTS.DELETE_RESPONSE(id))
        return response.data
    }
}