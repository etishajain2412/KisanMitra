import React from 'react';
import { ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../ui/card';


const MarketSection = () => {
  return (
    <div className="py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Market Hub
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Agricultural Marketplace with Bidding System</h2>
          <p className="text-lg text-gray-600">
            Connect directly with buyers and get the best price for your produce through our transparent bidding system. Cut out middlemen and increase your profits.
          </p>
          <ul className="space-y-4">
            <li className="flex">
              <TrendingUp className="h-6 w-6 text-green-500 flex-shrink-0 mr-3" />
              <span>Real-time market price updates to help you make informed decisions</span>
            </li>
            <li className="flex">
              <DollarSign className="h-6 w-6 text-green-500 flex-shrink-0 mr-3" />
              <span>Transparent bidding system ensuring fair prices for your produce</span>
            </li>
          </ul>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1531495515257-f8fa7946161c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dm"
            alt="Farmers market" 
            className="w-full h-96 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketSection;
