import { IntentRequest, IntentResponse, Intent } from "@/lib/types/intent-type"
import axiosInstance from "../axios"
import { INTENT_ENPOINTS } from "../endpoints"

export const intentService = {
    getall : async (query: string) : Promise<any> =>  {
        const response = await axiosInstance.get(INTENT_ENPOINTS.GET_ALL_INTENTS(query))
        return response.data
    },

    updateIntent: async (id: string,data: IntentRequest): Promise<IntentResponse> => {
        const response = await axiosInstance.patch(INTENT_ENPOINTS.UPDATE_INTENT(id), data)
        return response.data
    },

    deleteIntent: async (id: string) : Promise<any> => {
        const response = await axiosInstance.delete(INTENT_ENPOINTS.DELETE_INTENT(id))
        return response.data
    },

    createIntent: async (data: IntentRequest): Promise<Intent> =>{
        const response = await axiosInstance.post(INTENT_ENPOINTS.CREATE_INTENT, data);
        return response.data
    },

    restoreIntent: async (id: string): Promise<Intent> =>{
        const response = await axiosInstance.patch(INTENT_ENPOINTS.RESTORE_INTENT(id));
        return response.data;
    }
}