import axios from 'axios';
import { ICreateStory, IUpdateStory } from './storyTypes';

const API_URL = '/api/stories';

export const getStories = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const createStory = async (story: ICreateStory) => {
  const response = await axios.post(`${API_URL}`, story);
  return response.data;
};

export const updateStory = async (story: IUpdateStory) => {
  const response = await axios.put(`${API_URL}/${story._id}`, story);
  return response.data;
};

export const deleteStory = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};