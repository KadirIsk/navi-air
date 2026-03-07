import client from '../api/client';
import { type Location, type Page, type ApiResponse } from './locationService';

const API_URL = '/transportations';

export type TransportationType = 'FLIGHT' | 'BUS' | 'SUBWAY' | 'UBER';
export const TRANSPORTATION_TYPES: TransportationType[] = ['FLIGHT', 'BUS', 'SUBWAY', 'UBER'];

export type OperatingDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export const OPERATING_DAYS: OperatingDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export interface Transportation {
  id: number;
  originLocation: Location;
  destinationLocation: Location;
  transportationType: TransportationType;
  operatingDays: OperatingDay[];
}

export interface TransportationRequest {
  originLocationId: number;
  destinationLocationId: number;
  transportationType: TransportationType;
  operatingDays: OperatingDay[];
}

export interface TransportationFilter {
  originLocationId?: string;
  destinationLocationId?: string;
  transportationType?: string;
  operatingDays?: string;
}

export const getTransportations = async (page: number, pageSize: number, filters?: TransportationFilter): Promise<ApiResponse<Page<Transportation>>> => {
  const response = await client.get<ApiResponse<Page<Transportation>>>(API_URL, {
    params: {
      page: page - 1,
      size: pageSize,
      ...filters
    }
  });
  return response.data;
};

export const createTransportation = async (data: TransportationRequest): Promise<ApiResponse<Transportation>> => {
  const response = await client.post<ApiResponse<Transportation>>(API_URL, data);
  return response.data;
};

export const updateTransportation = async (id: number, data: TransportationRequest): Promise<ApiResponse<Transportation>> => {
  const response = await client.put<ApiResponse<Transportation>>(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteTransportation = async (id: number): Promise<void> => {
  await client.delete(`${API_URL}/${id}`);
};
