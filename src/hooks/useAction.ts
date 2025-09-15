import { actionService } from "@/lib/api/services/action-service"
import { CreateActionRequest, Action } from "@/lib/types/action-type"
import { useState } from "react"

export const useAction = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [actions, setActions] = useState<Action[]>([])
    const getAllAction = async (query: string): Promise<any> => {
        setIsLoading(true);
        setError(null);
    try {
        const response = await actionService.getAllAction(query)
        setActions(response)
        return response
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Không thể lấy danh sách action";
        setError(errorMessage);
        throw error
    }
    finally{
        setIsLoading(false);
    }
    }

    const createAction = async (data: CreateActionRequest) => {
        try {
            const response = await actionService.createAction(data)
            return response
        } catch (error) {
            throw error
        }
    }

    const updateAction = async (name: CreateActionRequest, id: string) => {
        try {
            const response = await actionService.updateAction(name,id);
            return response
        } catch (error) {
            throw error
        }
    }

    const deleteAction = async (id: string) => {
        try {
            const response = await actionService.deleteAction(id);
            return response
        } catch (error) {
            throw error
        }
    }
    return {
        actions,
        getAllAction,
        createAction,
        updateAction,
        deleteAction,
        isLoading,
        error,
    }
}