import { slotService } from "@/lib/api/services/slot-service"
import { CreateSlotRequest, UpdateSlotRequest, SlotListResponse } from "@/lib/types/slot-type";

export const useSlot = () => {
    const getAllSlot =  async (query: string)  => {
        const response = slotService.getAllSlot(query);
        return response
    }

    const createSlot = async (data: CreateSlotRequest) => {
        const response = slotService.createSlot(data);
        return response
    }

    const updateSlot = async (data: UpdateSlotRequest, id: string)=> {
        const response = slotService.updateSlot(data, id);
        return response;
    }

    const deleteSlot = async (id: string) => {
        const response = slotService.deleteSlot(id);
        return response;
    }

    return {
        getAllSlot,
        createSlot,
        updateSlot,
        deleteSlot
    }
}