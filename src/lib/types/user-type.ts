
export type Role = {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  chatbots: {
    _id: string;
    name: string;
    url: string;
  }[]
}
export type User = {
  _id: string;
  email: string;
  username: string;
  name: string;
  phone: string;
  address: string;
  dob: string;
  gender: "MALE" | "FEMALE";
  avatar: string;
  isVerified: boolean;
  role: Role;
  deleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  }

  export type UserResponse = {
    email: string;
    name: string;
    username: string;
    gender: "MALE" | "FEMALE";
    avatar: string;
    phone: string;
    address: string;
    dob: string
  }
  
  export type UserMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };


export type UserListResponse = {
  success: boolean;
  data: User[];
  meta: UserMeta;
  message?: string;
};



export type UpdateProfileRequest = {
  name: string;
  phone: string;
  dob: string;
  gender: "MALE" | "FEMALE";
  address: string;
};

export type UserProfile = User;
export type DeviceListResponse = {
    success: boolean;
    data: Device[];
    message?: string;
  };


  export type Device = {
    _id: string;
    token: string;
    userId: string;
    ip: string;
    os: string;
    iat: string;
    exp: string;
    deleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };

  export type TokenRequest = {
    token: string;
  }

