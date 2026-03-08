import client from '../api/client';

export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  code: string;
  message: string;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/auth/login', { username, password });
  return response.data;
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/auth/refresh', { refreshToken: token });
  return response.data;
};
