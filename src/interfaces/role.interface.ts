export interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  chatbots: string[];
  createdAt: string;
  updatedAt: string;
}