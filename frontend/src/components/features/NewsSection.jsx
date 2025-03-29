import React from 'react';
import { Newspaper, Info, Bell } from 'lucide-react';
import { Card, CardContent } from '../ui/card';


const NewsSection = () => {
  const newsItems = [
    {
      title: "New Government Subsidy for Organic Farmers",
      description: "The Ministry of Agriculture announced a new subsidy scheme for organic farmers...",
      date: "2 days ago"
    },
    {
      title: "Agricultural Trade Fair Coming to Delhi",
      description: "The annual agricultural trade fair will be held in Delhi next month, featuring...",
      date: "5 days ago"
    },
    {
      title: "Breakthrough in Pest Resistant Rice Variety",
      description: "Scientists have developed a new rice variety that shows remarkable resistance to common pests...",
      date: "1 week ago"
    }
  ];

  return (
    <div className="py-16 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="space-y-6">
            {newsItems.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="text-sm text-gray-500">{item.date}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Newspaper className="h-4 w-4 mr-2" />
            News & Updates
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Latest Agricultural News and Updates</h2>
          <p className="text-lg text-gray-600">
            Stay informed with the latest agricultural news, policy changes, and industry updates. Get timely information about new government schemes, subsidies, and agricultural innovations.
          </p>
          <ul className="space-y-4">
            <li className="flex">
              <Bell className="h-6 w-6 text-yellow-500 flex-shrink-0 mr-3" />
              <span>Personalized news alerts based on your crop and location</span>
            </li>
            <li className="flex">
              <Info className="h-6 w-6 text-yellow-500 flex-shrink-0 mr-3" />
              <span>Information about government schemes tailored for you</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;