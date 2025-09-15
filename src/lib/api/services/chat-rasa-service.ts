import axios from "axios";



export const sendMessageToRasa = async (baseUrl: string ,message: string) => {
  const response = await axios.post(baseUrl, {
    message,
  });
  return response.data; 
};