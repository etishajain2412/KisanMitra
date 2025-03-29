import React from 'react';
import { Video, Play, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const VideoTutorials = () => {
  const tutorials = [
    {
      title: "Modern Irrigation Techniques",
      duration: "15 min",
      thumbnail: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aXJyaWdhdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
      category: "Water Management"
    },
    {
      title: "Organic Pest Control Methods",
      duration: "12 min",
      thumbnail: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8b3JnYW5pYyUyMGZhcm1pbmd8ZW58MHx8MHx8fDA%3D",
      category: "Organic Farming"
    },
    {
      title: "Soil Health Management",
      duration: "18 min",
      thumbnail: "https://images.unsplash.com/photo-1510168857732-a85e07c0e1f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29pbHxlbnwwfHwwfHx8MA%3D%3D",
      category: "Soil Fertility"
    }
  ];

  return (
    <div className="py-16 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Video className="h-4 w-4 mr-2" />
            Video Tutorials
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Learn Modern Farming Techniques</h2>
          <p className="text-lg text-gray-600">
            Access our library of educational videos covering various aspects of modern and sustainable farming. Learn at your own pace from agricultural experts and successful farmers.
          </p>
          <ul className="space-y-4">
            <li className="flex">
              <BookOpen className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3" />
              <span>Comprehensive tutorials on crop-specific techniques</span>
            </li>
            <li className="flex">
              <Play className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3" />
              <span>Watch offline by downloading videos for areas with poor connectivity</span>
            </li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {tutorials.map((tutorial, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-1/3">
                    <img 
                      src={tutorial.thumbnail} 
                      alt={tutorial.title} 
                      className="w-full h-40 sm:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="rounded-full bg-white p-2">
                        <Play className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:w-2/3">
                    <div className="text-xs text-gray-500 mb-1">{tutorial.category} • {tutorial.duration}</div>
                    <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                    <button className="text-blue-600 text-sm font-medium flex items-center">
                      Watch Now <Play className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoTutorials;