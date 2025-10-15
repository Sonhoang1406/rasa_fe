import { ICreateStory, IUpdateStory } from '@/interfaces/story.interface';
import { useState, useEffect } from 'react';
import { createStory, deleteStory, getStories, updateStory } from '../services/storyService';

export const useStory = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const data = await getStories();
      setStories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addStory = async (story: ICreateStory) => {
    try {
      await createStory(story);
      fetchStories();
    } catch (error) {
      console.error(error);
    }
  };

  const editStory = async (story: IUpdateStory) => {
    try {
      await updateStory(story);
      fetchStories();
    } catch (error) {
      console.error(error);
    }
  };

  const removeStory = async (id: string) => {
    try {
      await deleteStory(id);
      fetchStories();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return { stories, loading, addStory, editStory, removeStory };
};