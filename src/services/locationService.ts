import client from '../api/client';

export interface Location {
  id: number;
  name: string;
  country: string;
  city: string;
  locationCode: string;
}

export interface Page<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  code: string;
  message: string;
}

export interface LocationFilter {
  city?: string;
  locationCode?: string;
  country?: string;
  name?: string;
}

export const getLocations = async (page: number, limit: number, filters?: LocationFilter): Promise<ApiResponse<Page<Location>>> => {
  const response = await client.get<ApiResponse<Page<Location>>>('/locations', {
    params: {
      page: page - 1,
      size: limit,
      ...filters
    }
  });
  return response.data;
};

export const deleteLocation = async (id: number): Promise<void> => {
  await client.delete(`/locations/${id}`);
};

export const createLocation = async (location: Omit<Location, 'id'>): Promise<ApiResponse<Location>> => {
  const response = await client.post<ApiResponse<Location>>('/locations', location);
  return response.data;
};

export const updateLocation = async (id: number, location: Partial<Location>): Promise<ApiResponse<Location>> => {
  const response = await client.put<ApiResponse<Location>>(`/locations/${id}`, location);
  return response.data;
};
