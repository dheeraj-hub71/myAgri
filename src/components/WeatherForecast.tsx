import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Loader2, MapPin, Sun, ThermometerSun, Wind, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";

// Indian cities for the dropdown
const indianCities = [
  "New Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", 
  "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Lucknow",
  "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
  "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
  "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot",
  "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar"
];

export default function WeatherForecast() {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("New Delhi");
  const [searchInput, setSearchInput] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showCitiesList, setShowCitiesList] = useState(false);
  const { toast } = useToast();
  
  // Mock weather data - would be replaced with actual API call
  const [weatherData, setWeatherData] = useState({
    location: "New Delhi, India",
    temperature: 32,
    condition: "Sunny",
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: "Today", temp: 32, condition: "Sunny" },
      { day: "Tomorrow", temp: 30, condition: "Partly Cloudy" },
      { day: "Wednesday", temp: 29, condition: "Rainy" },
    ],
    farmingTips: "High temperature and humidity. Consider irrigation in the morning or evening. Watch for heat stress in crops."
  });
  
  // Filter cities based on search input
  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredCities([]);
      return;
    }
    
    const filtered = indianCities.filter(city => 
      city.toLowerCase().includes(searchInput.toLowerCase())
    ).slice(0, 5); // Limit to 5 results
    
    setFilteredCities(filtered);
  }, [searchInput]);
  
  // Simulate fetching weather data when location changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      
      // Simulate API call with a delay
      setTimeout(() => {
        // Update weather data based on location
        // In a real app, this would call a weather API
        const newData = {
          ...weatherData,
          location: `${location}, India`,
          // Randomize some values to simulate different weather
          temperature: Math.floor(Math.random() * 15) + 25, // 25-40°C
          humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
          windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
        };
        
        setWeatherData(newData);
        setLoading(false);
        
        toast({
          title: "Weather Updated",
          description: `Weather data for ${location} has been updated.`
        });
      }, 1000);
    };
    
    fetchWeatherData();
  }, [location]);
  
  const handleLocationSelect = (city: string) => {
    setLocation(city);
    setSearchInput("");
    setShowCitiesList(false);
  };
  
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-amber-500" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'partly cloudy':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />;
    }
  };
  
  return (
    <Card className="w-full h-full glass-morphism card-hover flex flex-col">
      <CardHeader className="space-y-1">
        <div className="subtle-chip">Real-Time</div>
        <CardTitle className="text-2xl">Weather Forecast</CardTitle>
        <CardDescription>Weather-based farming recommendations</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="relative mb-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search for a city in India..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowCitiesList(true);
              }}
              onFocus={() => setShowCitiesList(true)}
              className="w-full"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowCitiesList(!showCitiesList)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          {showCitiesList && filteredCities.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredCities.map((city, i) => (
                <Button 
                  key={i} 
                  variant="ghost" 
                  className="w-full justify-start px-3 py-2 text-left hover:bg-secondary"
                  onClick={() => handleLocationSelect(city)}
                >
                  <MapPin className="h-4 w-4 mr-2" /> {city}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{weatherData.location}</span>
                </div>
                <div className="flex items-end mt-1">
                  <span className="text-4xl font-bold">{weatherData.temperature}°</span>
                  <span className="text-lg ml-1 mb-1">C</span>
                </div>
                <div className="text-sm">{weatherData.condition}</div>
              </div>
              <div className="text-6xl">
                {getWeatherIcon(weatherData.condition)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-3 rounded-lg flex items-center gap-2">
                <ThermometerSun className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Humidity</div>
                  <div className="font-medium">{weatherData.humidity}%</div>
                </div>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Wind Speed</div>
                  <div className="font-medium">{weatherData.windSpeed} km/h</div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">3-Day Forecast</h4>
              <div className="grid grid-cols-3 gap-2">
                {weatherData.forecast.map((day, i) => (
                  <div key={i} className="text-center p-2">
                    <div className="text-sm font-medium">{day.day}</div>
                    <div className="my-1 flex justify-center">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="text-sm">{day.temp}°C</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-secondary p-3 rounded-lg mt-4">
              <h4 className="text-sm font-medium mb-1">Farming Recommendation:</h4>
              <p className="text-xs text-muted-foreground">{weatherData.farmingTips}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
