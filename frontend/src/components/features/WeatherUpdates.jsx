import React from 'react';
import { CloudRain, Sun, Wind, Droplets } from 'lucide-react';
import { Card, CardContent } from '../ui/card';


const WeatherUpdates = () => {
  const weekForecast = [
    { day: "MON", temp: "32°", icon: <Sun className="h-8 w-8 text-yellow-500" />, condition: "Sunny" },
    { day: "TUE", temp: "30°", icon: <CloudRain className="h-8 w-8 text-blue-500" />, condition: "Rain" },
    { day: "WED", temp: "28°", icon: <CloudRain className="h-8 w-8 text-blue-500" />, condition: "Rain" },
    { day: "THU", temp: "31°", icon: <Sun className="h-8 w-8 text-yellow-500" />, condition: "Sunny" },
    { day: "FRI", temp: "33°", icon: <Sun className="h-8 w-8 text-yellow-500" />, condition: "Sunny" },
  ];

  return (
    <div className="py-16 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Delhi, India</h3>
                  <p className="text-gray-600">Tuesday, 20 April</p>
                </div>
                <div className="text-4xl font-bold">32°C</div>
              </div>
              
              <div className="flex items-center mb-8 bg-white bg-opacity-70 p-3 rounded-lg">
                <Sun className="h-16 w-16 text-yellow-500" />
                <div className="ml-4">
                  <div className="text-xl font-semibold">Sunny</div>
                  <div className="text-gray-600">Feels like 34°C</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white bg-opacity-70 p-3 rounded-lg flex flex-col items-center">
                  <Wind className="h-6 w-6 text-gray-500 mb-2" />
                  <div className="text-sm text-gray-600">Wind</div>
                  <div className="font-semibold">12 km/h</div>
                </div>
                <div className="bg-white bg-opacity-70 p-3 rounded-lg flex flex-col items-center">
                  <Droplets className="h-6 w-6 text-blue-500 mb-2" />
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="font-semibold">65%</div>
                </div>
                <div className="bg-white bg-opacity-70 p-3 rounded-lg flex flex-col items-center">
                  <CloudRain className="h-6 w-6 text-blue-500 mb-2" />
                  <div className="text-sm text-gray-600">Rain Chance</div>
                  <div className="font-semibold">15%</div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                <h4 className="font-semibold mb-3">Week Forecast</h4>
                <div className="flex justify-between">
                  {weekForecast.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-sm font-medium">{day.day}</div>
                      {day.icon}
                      <div className="text-sm font-medium mt-1">{day.temp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CloudRain className="h-4 w-4 mr-2" />
            Weather Updates
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Stay Ahead with Weather Forecasts</h2>
          <p className="text-lg text-gray-600">
            Get accurate, localized weather forecasts to plan your farming activities effectively. Receive alerts for extreme weather conditions to protect your crops.
          </p>
          <ul className="space-y-4">
            <li className="flex">
              <CloudRain className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3" />
              <span>7-day weather forecasts specific to your farm location</span>
            </li>
            <li className="flex">
              <Wind className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3" />
              <span>Extreme weather alerts sent directly to your phone</span>
            </li>
            <li className="flex">
              <Droplets className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3" />
              <span>Rainfall predictions and irrigation recommendations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeatherUpdates;