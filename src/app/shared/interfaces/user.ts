export interface User {}

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

export interface RegistrationError {
  error: {
    message: string;
  };
  status: number;
}
