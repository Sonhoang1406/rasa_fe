import { responseService } from "@/lib/api/services/response-service";
import { ResponseRequest, ResponseResponse } from "@/lib/types/response-type";

export const useResponse = () => {
  const responses = async (query: string) => {
    try {
      const response = await responseService.getall(query);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const updateResponse = async (
    id: string,
    data: ResponseRequest
  ): Promise<ResponseResponse | undefined> => {
    try {
      const response = await responseService.updateResponse(id, data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteResponse = async (id: string) => {
    try {
      const response = await responseService.deleteResponse(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  return {
    responses,
    updateResponse,
    deleteResponse,
  };
};
