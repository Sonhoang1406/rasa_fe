import { CreateSlotRequest, UpdateSlotRequest } from "@/lib/types/slot-type"
import axiosInstance from "../axios"
import { SLOT_ENDPOINTS } from "../endpoints"

export const slotService = {
    getAllSlot: async (query: string) : Promise<any>  => {
        const response = await axiosInstance.get(SLOT_ENDPOINTS.GET_ALL_SLOT(query))
        return response.data
    },

    createSlot: async (data: CreateSlotRequest) : Promise<any> => {
        const response = await axiosInstance.post(SLOT_ENDPOINTS.CREATE_SLOT, data)
        return response.data
    },

    updateSlot: async (data: UpdateSlotRequest, id: string) : Promise<any> => {
        const response = await axiosInstance.patch(SLOT_ENDPOINTS.UPDATE_SLOT(id), data)
        return response.data
    },

    deleteSlot: async (id: string): Promise<any> => {
        const response = await axiosInstance.delete(SLOT_ENDPOINTS.DELETE_SLOT(id))
        return response.data
    }


}
