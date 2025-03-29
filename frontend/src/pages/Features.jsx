import React from 'react';
import MarketSection from '../components/features/MarketSection';
import NewsSection from '../components/features/NewsSection';
import SuccessStories from '../components/features/SuccessStories';
import VideoTutorials from '../components/features/VideoTutorials';
import FarmerConnect from '../components/features/FarmerConnect';
import ReviewSystem from '../components/features/ReviewSystem';
import WeatherUpdates from '../components/features/WeatherUpdates';
import FarmingTechniques from '../components/features/FarmingTechniques';
import Header from '../components/Header';

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
     <Header/>
      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h2 className="text-base text-green-700 font-semibold tracking-wide uppercase">Our Features</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Empowering Farmers with Technology
            </p>
            <p className="mt-4 max-w-3xl text-xl text-gray-500 mx-auto">
              KisanMitra offers a complete suite of tools designed specifically for farmers to increase productivity, gain market insights, and build community.
            </p>
          </div>

          <MarketSection />
          <NewsSection />
          <SuccessStories />
          <VideoTutorials />
          <FarmerConnect />
          <ReviewSystem />
          <WeatherUpdates />
          <FarmingTechniques />
        </div>
      </div>
 
    </div>
  );
};

export default Features;