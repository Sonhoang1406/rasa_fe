export interface ICreateStory {
  name: string;
  description: string;
  define: string;
  intents: string[];
  responses: string[];
  action: string[];
  entities: string[];
  slots: string[];
  roles: string[];
}

export interface IUpdateStory extends ICreateStory {
  _id: string;
}