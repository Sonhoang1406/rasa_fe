
import { CreateActionRequest } from "@/lib/types/action-type"
import axiosInstance from "../axios"
import { ACTION_ENPOINTS } from "../endpoints"



export const actionService = {
    getAllAction: async (query: string) : Promise<any>  => {
        const response = await axiosInstance.get(ACTION_ENPOINTS.GET_ALL_ACTIONS(query))
        return response.data
    },

    createAction: async(data: CreateActionRequest) : Promise<any> => {
        const response = await axiosInstance.post(ACTION_ENPOINTS.CREATE_ACTIONS,data)
        return response.data;
    },
    updateAction: async (name: CreateActionRequest, id: string): Promise<any> => {
        const response = await axiosInstance.patch(ACTION_ENPOINTS.UPDATE_ACTIONS(id), name)
        return response.data
    },

    deleteAction: async (id: string) => {
        const response = await axiosInstance.delete(ACTION_ENPOINTS.DELETE_ACTIONS(id))
        return response.data
    }


}