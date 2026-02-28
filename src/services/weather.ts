import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY;
const BASE_URL = 'https://api.weatherstack.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    access_key: API_KEY,
  },
});

export interface WeatherCurrent {
  observation_time: string;
  temperature: number;
  weather_code: number;
  weather_icons: string[];
  weather_descriptions: string[];
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  pressure: number;
  precip: number;
  humidity: number;
  cloudcover: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
  is_day: string;
}

export interface WeatherLocation {
  name: string;
  country: string;
  region: string;
  lat: string;
  lon: string;
  timezone_id: string;
  localtime: string;
  localtime_epoch: number;
  utc_offset: string;
}

export interface CurrentWeatherResponse {
  request: {
    type: string;
    query: string;
    language: string;
    unit: string;
  };
  location: WeatherLocation;
  current: WeatherCurrent;
  error?: {
    code: number;
    type: string;
    info: string;
  };
}

export const weatherService = {
  /**
   * Fetches real-time current weather from the API.
   */
  async getCurrentWeather(query: string = 'New York'): Promise<CurrentWeatherResponse> {
    const response = await apiClient.get<CurrentWeatherResponse>('/current', {
      params: { query },
    });
    
    if (response.data.error) {
      throw new Error(response.data.error.info || 'Failed to fetch weather data');
    }
    
    return response.data;
  },

  /**
   * Mock Forecast Data (Premium feature on Weatherstack)
   */
  async getForecast(query: string = 'New York') {
    // Simulating network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    return {
      location: { name: query.split(',')[0], country: "Simulated", region: "Simulated" },
      forecast: Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return {
          date: date.toISOString().split('T')[0],
          mintemp: Math.floor(Math.random() * 10) + 5,
          maxtemp: Math.floor(Math.random() * 15) + 15,
          avgtemp: Math.floor(Math.random() * 15) + 10,
          weather_descriptions: ["Partly Cloudy", "Sunny", "Light Rain"][Math.floor(Math.random() * 3)],
          uv_index: Math.floor(Math.random() * 8) + 1,
          humidity: Math.floor(Math.random() * 40) + 40,
        };
      })
    };
  },

  /**
   * Mock Historical Data (Premium feature on Weatherstack)
   */
  async getHistoricalWeather(query: string = 'New York', date: string) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    return {
      location: { name: query.split(',')[0], country: "Simulated", region: "Simulated" },
      historical: {
        [date]: {
          date: date,
          mintemp: Math.floor(Math.random() * 10) + 5,
          maxtemp: Math.floor(Math.random() * 15) + 15,
          avgtemp: Math.floor(Math.random() * 15) + 10,
          totalsnow: 0,
          sunhour: 10.5,
          uv_index: 4,
          hourly: Array.from({ length: 8 }).map((_, i) => ({
            time: `${i * 300}`,
            temperature: Math.floor(Math.random() * 20) + 5,
            weather_descriptions: ["Clear", "Overcast"][Math.floor(Math.random() * 2)],
          }))
        }
      }
    };
  },

  /**
   * Mock Marine Weather (Premium feature on Weatherstack)
   */
  async getMarineWeather(lat: string = "45.00", lon: string = "-2.00") {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    return {
      location: { lat, lon, name: "Marine Location" },
      marine: {
        water_temp: 14 + Math.random() * 5,
        sig_height_m: (0.5 + Math.random() * 2).toFixed(1),
        swell_height: (1.0 + Math.random() * 2).toFixed(1),
        swell_dir_16_point: ["N", "NNE", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 9)],
        tides: [
          { tideTime: "04:00 AM", tideHeight_mt: "4.2", tide_type: "HIGH" },
          { tideTime: "10:30 AM", tideHeight_mt: "0.5", tide_type: "LOW" },
          { tideTime: "04:45 PM", tideHeight_mt: "4.4", tide_type: "HIGH" },
          { tideTime: "11:15 PM", tideHeight_mt: "0.6", tide_type: "LOW" },
        ]
      }
    };
  },
  
  /**
   * Mock Location Autocomplete (to avoid burning through API limit, or use actual if needed)
   */
  async searchLocation(query: string = '') {
      // Free tier allows location lookup `/autocomplete`? Actually autocomplete might be Standard plan only.
      // Let's mock it to be safe and ensure the UI works flawlessly.
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const mockLocations = [
        { name: "New York", region: "New York", country: "United States of America", lat: "40.714", lon: "-74.006" },
        { name: "London", region: "City of London, Greater London", country: "United Kingdom", lat: "51.517", lon: "-0.106" },
        { name: "Tokyo", region: "Tokyo", country: "Japan", lat: "35.689", lon: "139.692" },
        { name: "Paris", region: "Ile-de-France", country: "France", lat: "48.853", lon: "2.349" },
        { name: "Sydney", region: "New South Wales", country: "Australia", lat: "-33.883", lon: "151.217" }
      ];

      return mockLocations.filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()));
  }
};
