// import client from '../api/client'; // Backend hazır olduğunda bunu kullanacağız

export interface Location {
  id: number;
  name: string;
  country: string;
  city: string;
  locationCode: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const getLocations = async (page: number, limit: number): Promise<PaginatedResponse<Location>> => {

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { id: 1, name: 'Istanbul Airport', country: 'Turkey', city: 'Istanbul', locationCode: 'IST' },
          { id: 2, name: 'Sabiha Gokcen Airport', country: 'Turkey', city: 'Istanbul', locationCode: 'SAW' },
          { id: 3, name: 'Heathrow Airport', country: 'UK', city: 'London', locationCode: 'LHR' },
          { id: 4, name: 'JFK Airport', country: 'USA', city: 'New York', locationCode: 'JFK' },
          { id: 5, name: 'Haneda Airport', country: 'Japan', city: 'Tokyo', locationCode: 'HND' },
        ],
        total: 5,
        page,
        limit
      });
    }, 500);
  });
};

export const deleteLocation = async (id: number): Promise<void> => {
  console.log(`Location ${id} deleted mock request.`);
  return Promise.resolve();
};
