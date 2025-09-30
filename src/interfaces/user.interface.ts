import { IRole } from "./role.interface";

export interface IUser {
  message: string;
  data: {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  avatar: string;
  is2FAEnabled: boolean;
  roles: IRole[];
  createdAt: string;
  updatedAt: string;
  },
  success: boolean;
}