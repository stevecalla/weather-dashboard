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

const rawCurrentWeather = '{"coord":{"lon":-105.3505,"lat":40.0833},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"stations","main":{"temp":81.99,"feels_like":79.9,"temp_min":78.24,"temp_max":86.02,"pressure":1018,"humidity":21},"visibility":10000,"wind":{"speed":6.91,"deg":30},"clouds":{"all":0},"dt":1658509883,"sys":{"type":2,"id":2005795,"country":"US","sunrise":1658490632,"sunset":1658543089},"timezone":-21600,"id":5574999,"name":"Boulder","cod":200}';

const currentWeather = JSON.parse(rawCurrentWeather);
console.log(currentWeather);