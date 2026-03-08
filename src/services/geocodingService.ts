import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

const cache: Record<string, [number, number]> = {};

export const getCoordinates = async (locationName: string): Promise<[number, number] | null> => {
  if (cache[locationName]) {
    return cache[locationName];
  }

  try {
    const response = await axios.get(NOMINATIM_BASE_URL, {
      params: {
        q: locationName,
        format: 'json',
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      const lat = parseFloat(response.data[0].lat);
      const lon = parseFloat(response.data[0].lon);
      const coords: [number, number] = [lat, lon];
      
      cache[locationName] = coords;
      return coords;
    }
    return null;
  } catch (error) {
    console.error(`Failed to geocode location: ${locationName}`, error);
    return null;
  }
};
