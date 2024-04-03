interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  createdAt: string;
  updatedAt: string;
}

interface Roles {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  UserRole?: UserRole;
}

export interface User {
  email: string;
  id: number;
  roles: Roles[];
  iat: number;
  exp: number;
}

export interface RegistrationUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegistrationRequestBody {
  email: string;
  password: string;
  fio: string;
}

export interface RegistrationResponse {
  token: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface FetchError {
  error:
    | {
        message: string;
      }
    | string[];
  status: number;
}
