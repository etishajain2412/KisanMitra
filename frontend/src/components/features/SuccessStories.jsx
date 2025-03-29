import React from 'react';
import { Award, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/card';


const SuccessStories = () => {
  const stories = [
    {
      name: "Ramesh Patel",
      location: "Gujarat",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      story: "After using KisanMitra's market platform, I was able to sell my wheat directly to flour mills. My income increased by 35% compared to selling to local traders.",
      impact: "35% increase in income"
    },
    {
      name: "Lakshmi Devi",
      location: "Tamil Nadu",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      story: "The weather predictions helped me plan my rice planting. When others lost crops to unexpected rain, mine survived because I had harvested early based on KisanMitra's alert.",
      impact: "Saved entire crop from damage"
    },
    {
      name: "Mohammad Imran",
      location: "Uttar Pradesh",
      image: "https://randomuser.me/api/portraits/men/36.jpg",
      story: "I learned organic farming techniques through KisanMitra's video tutorials. Now I produce chemical-free vegetables and earn premium prices in the city markets.",
      impact: "40% higher profits with organic produce"
    }
  ];

  return (
    <div className="py-16 border-t border-gray-100">
      <div className="space-y-6 text-center mb-12">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
          <Award className="h-4 w-4 mr-2" />
          Success Stories
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Farmers Thriving with KisanMitra</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover how farmers across India have transformed their agricultural practices and improved their livelihoods with KisanMitra.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story, index) => (
          <Card key={index} className="hover:shadow-lg transition-all overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img src={story.image} alt={story.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h3 className="font-semibold">{story.name}</h3>
                    <p className="text-sm text-gray-500">{story.location}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{story.story}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {story.impact}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;