import React from 'react';
import { Users, MessageCircle, UserPlus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const FarmerConnect = () => {
  return (
    <div className="py-16 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 shadow-lg">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="Farmer" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <div className="font-medium">Amit Singh</div>
                    <p className="text-sm text-gray-600 mt-1">Has anyone tried the new BT cotton seeds? What was your experience with pest resistance?</p>
                    <div className="mt-3 flex space-x-3">
                      <button className="text-xs flex items-center text-gray-500 hover:text-green-600">
                        <MessageCircle className="h-3 w-3 mr-1" /> Reply (8)
                      </button>
                      <span className="text-xs text-gray-400">Posted 2h ago</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <img src="https://randomuser.me/api/portraits/women/22.jpg" alt="Farmer" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <div className="font-medium">Priya Kumari</div>
                    <p className="text-sm text-gray-600 mt-1">Looking for farmers in Bihar interested in forming a vegetable cooperative to supply to city markets directly.</p>
                    <div className="mt-3 flex space-x-3">
                      <button className="text-xs flex items-center text-gray-500 hover:text-green-600">
                        <MessageCircle className="h-3 w-3 mr-1" /> Reply (12)
                      </button>
                      <span className="text-xs text-gray-400">Posted 5h ago</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <img src="https://randomuser.me/api/portraits/men/24.jpg" alt="Expert" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <div className="font-medium">Dr. Rajesh Verma <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded ml-2">Agricultural Expert</span></div>
                    <p className="text-sm text-gray-600 mt-1">I'll be hosting a live Q&A session on drought-resistant crops tomorrow at 4 PM. Join to ask your questions!</p>
                    <div className="mt-3 flex space-x-3">
                      <button className="text-xs flex items-center text-gray-500 hover:text-green-600">
                        <MessageCircle className="h-3 w-3 mr-1" /> Reply (23)
                      </button>
                      <span className="text-xs text-gray-400">Posted 1d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <Users className="h-4 w-4 mr-2" />
            Farmer Connect
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Join the Farmer Community</h2>
          <p className="text-lg text-gray-600">
            Connect with fellow farmers, agricultural experts, and industry professionals. Share knowledge, ask questions, and form local cooperatives for better market access.
          </p>
          <ul className="space-y-4">
            <li className="flex">
              <MessageCircle className="h-6 w-6 text-purple-500 flex-shrink-0 mr-3" />
              <span>Discussion forums organized by crop type and region</span>
            </li>
            <li className="flex">
              <UserPlus className="h-6 w-6 text-purple-500 flex-shrink-0 mr-3" />
              <span>Connect with agricultural experts for personalized advice</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FarmerConnect;