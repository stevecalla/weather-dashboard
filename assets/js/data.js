const cityList = [
  {city: "Atlanta",
   state: "GA",
  },
  {city: "Austin",
   state: "TX",
  },
  {city: "Boston",
   state: "MA",
  },
  {city: "Boulder",
   state: "CO",
  },
  {city: "Chicago",
   state: "IL",
  },
  {city: "Denver",
   state: "CO",
  },
  {city: "Los Angeles",
   state: "CA",
  },
]


const rawWeatherData = '{ "lat": 40.0497, "lon": -105.2143, "timezone": "America/Denver", "timezone_offset": -21600, "current": { "dt": 1658551359, "sunrise": 1658490605, "sunset": 1658543051, "temp": 76.08, "feels_like": 75.22, "pressure": 1010, "humidity": 39, "dew_point": 49.35, "uvi": 0, "clouds": 0, "visibility": 10000, "wind_speed": 3.44, "wind_deg": 240, "weather": [ { "id": 800, "main": "Clear", "description": "clear sky", "icon": "01n" } ] }, "daily": [ { "dt": 1658516400, "sunrise": 1658490605, "sunset": 1658543051, "moonrise": 1658473620, "moonset": 1658526240, "moon_phase": 0.82, "temp": { "day": 94.41, "min": 68.14, "max": 96.42, "night": 76.08, "eve": 86.94, "morn": 72.86 }, "feels_like": { "day": 89.85, "night": 75.22, "eve": 83.82, "morn": 71.11 }, "pressure": 1009, "humidity": 13, "dew_point": 34.52, "wind_speed": 13.4, "wind_deg": 219, "wind_gust": 15.64, "weather": [ { "id": 803, "main": "Clouds", "description": "broken clouds", "icon": "04d" } ], "clouds": 63, "pop": 0.03, "uvi": 9.88 }, { "dt": 1658602800, "sunrise": 1658577057, "sunset": 1658629404, "moonrise": 1658561760, "moonset": 1658616300, "moon_phase": 0.85, "temp": { "day": 96.62, "min": 67.77, "max": 98.92, "night": 68.34, "eve": 72.5, "morn": 75.63 }, "feels_like": { "day": 92.1, "night": 67.75, "eve": 72.03, "morn": 74.41 }, "pressure": 1005, "humidity": 14, "dew_point": 38.61, "wind_speed": 13.06, "wind_deg": 21, "wind_gust": 17.27, "weather": [ { "id": 500, "main": "Rain", "description": "light rain", "icon": "10d" } ], "clouds": 96, "pop": 0.51, "rain": 0.51, "uvi": 9.07 }, { "dt": 1658689200, "sunrise": 1658663509, "sunset": 1658715755, "moonrise": 1658650200, "moonset": 1658706300, "moon_phase": 0.88, "temp": { "day": 86.99, "min": 63.54, "max": 87.19, "night": 67.48, "eve": 72.01, "morn": 69.19 }, "feels_like": { "day": 84.42, "night": 67.03, "eve": 71.78, "morn": 68.34 }, "pressure": 1011, "humidity": 28, "dew_point": 49.01, "wind_speed": 12.53, "wind_deg": 263, "wind_gust": 14.18, "weather": [ { "id": 500, "main": "Rain", "description": "light rain", "icon": "10d" } ], "clouds": 100, "pop": 0.57, "rain": 1.31, "uvi": 8.17 }, { "dt": 1658775600, "sunrise": 1658749963, "sunset": 1658802104, "moonrise": 1658739060, "moonset": 1658796060, "moon_phase": 0.91, "temp": { "day": 91.31, "min": 62.49, "max": 96.94, "night": 79.72, "eve": 95.49, "morn": 66.97 }, "feels_like": { "day": 87.1, "night": 79.72, "eve": 90.59, "morn": 66 }, "pressure": 1009, "humidity": 14, "dew_point": 35.15, "wind_speed": 10.85, "wind_deg": 105, "wind_gust": 15.28, "weather": [ { "id": 802, "main": "Clouds", "description": "scattered clouds", "icon": "03d" } ], "clouds": 38, "pop": 0.37, "uvi": 11.22 }, { "dt": 1658862000, "sunrise": 1658836416, "sunset": 1658888452, "moonrise": 1658828340, "moonset": 1658885460, "moon_phase": 0.94, "temp": { "day": 85.37, "min": 67.42, "max": 93.24, "night": 72.25, "eve": 92.08, "morn": 67.51 }, "feels_like": { "day": 83.07, "night": 71.71, "eve": 88.25, "morn": 65.66 }, "pressure": 1012, "humidity": 29, "dew_point": 48.6, "wind_speed": 10.76, "wind_deg": 93, "wind_gust": 16.49, "weather": [ { "id": 500, "main": "Rain", "description": "light rain", "icon": "10d" } ], "clouds": 57, "pop": 0.32, "rain": 0.32, "uvi": 10.14 }, { "dt": 1658948400, "sunrise": 1658922870, "sunset": 1658974798, "moonrise": 1658917980, "moonset": 1658974440, "moon_phase": 0.97, "temp": { "day": 79.16, "min": 58.21, "max": 90.23, "night": 72.37, "eve": 90.23, "morn": 58.21 }, "feels_like": { "day": 79.16, "night": 72.03, "eve": 87.06, "morn": 57.96 }, "pressure": 1014, "humidity": 45, "dew_point": 54.32, "wind_speed": 11.45, "wind_deg": 95, "wind_gust": 13.51, "weather": [ { "id": 500, "main": "Rain", "description": "light rain", "icon": "10d" } ], "clouds": 43, "pop": 0.56, "rain": 0.44, "uvi": 11 }, { "dt": 1659034800, "sunrise": 1659009325, "sunset": 1659061143, "moonrise": 1659007920, "moonset": 1659063000, "moon_phase": 0, "temp": { "day": 83.1, "min": 63.05, "max": 83.1, "night": 68.54, "eve": 74.5, "morn": 63.05 }, "feels_like": { "day": 82.56, "night": 68.11, "eve": 74.05, "morn": 62.73 }, "pressure": 1013, "humidity": 41, "dew_point": 55.33, "wind_speed": 7.87, "wind_deg": 97, "wind_gust": 6.8, "weather": [ { "id": 500, "main": "Rain", "description": "light rain", "icon": "10d" } ], "clouds": 30, "pop": 1, "rain": 4.76, "uvi": 11 }, { "dt": 1659121200, "sunrise": 1659095780, "sunset": 1659147486, "moonrise": 1659097980, "moonset": 1659151320, "moon_phase": 0.03, "temp": { "day": 81.57, "min": 62.4, "max": 81.57, "night": 68.54, "eve": 76.19, "morn": 62.4 }, "feels_like": { "day": 81.1, "night": 68.05, "eve": 75.81, "morn": 61.86 }, "pressure": 1015, "humidity": 40, "dew_point": 53.2, "wind_speed": 6.51, "wind_deg": 95, "wind_gust": 7.16, "weather": [ { "id": 500, "main": "Rain", "description": "light rain", "icon": "10d" } ], "clouds": 14, "pop": 0.91, "rain": 1.81, "uvi": 11 } ] }';

const weather = JSON.parse(rawWeatherData);

let currentWeather = [];
currentWeather.push(weather);
console.log(currentWeather)

// console.log(weather, currentWeather, currentWeather.length);
