import { RouteRequest, RouteApiResponse } from '@/types/route';

const ROUTE_API_BASE_URL = 'https://synthari-swap-backend.vercel.app';

export class RouteService {
  private static async makeRequest<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await fetch(`${ROUTE_API_BASE_URL}${endpoint}`, {
        method: data ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Route service request failed:', error);
      throw error;
    }
  }

  static async getBestRoute(request: RouteRequest): Promise<RouteApiResponse> {
    return this.makeRequest<RouteApiResponse>('/getBestRoute', request);
  }
}
