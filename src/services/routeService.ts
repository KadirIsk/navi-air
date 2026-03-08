import client from '../api/client';
import { type ApiResponse } from './locationService';

const API_URL = '/routes';

export interface RouteStep {
  origin: string;
  destination: string;
  transportationType: string;
}

export interface RouteDetail {
  title: string;
  steps: RouteStep[];
}

export interface RouteResponseItem {
  route: RouteDetail;
}

export const getRoutes = async (originId: number, destinationId: number, operatingDays: string): Promise<ApiResponse<RouteResponseItem[]>> => {
  const response = await client.get<ApiResponse<RouteResponseItem[]>>(API_URL, {
    params: {
      originId,
      destinationId,
      operatingDays
    }
  });
  return response.data;
};
