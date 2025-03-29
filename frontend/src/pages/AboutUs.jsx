import React from 'react';
import Header from '../components/Header';
import { 
  Users, Leaf, BarChart3, Lightbulb, 
  ShoppingCart, GraduationCap, CloudSun, HandshakeIcon
} from 'lucide-react';

const AboutUs = () => {
  return (
    <>  <Header />
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white z-0">
    
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-green-700/5 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-green-700">KisanMitra</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Empowering farmers with technology, knowledge, and market access
            </p>
          </div>
        </div>
      </div>
      
      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Farmers in field" 
                className="rounded-xl shadow-xl w-full h-96 object-cover"
              />
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-700 mb-6">
                KisanMitra is a digital platform designed to empower farmers by providing access to better markets, 
                agricultural resources, and expert guidance. We aim to bridge the gap between traditional farming 
                and modern technology, ensuring farmers get fair prices, valuable insights, and a strong support network.
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-block w-12 h-1 bg-green-700 rounded"></span>
                <span className="inline-block w-3 h-1 bg-yellow-500 rounded"></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-700">
              What drives us and where we're headed
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-md p-8 transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To revolutionize agriculture by offering farmers a seamless platform for buying, 
                selling, and learning—helping them get fair prices, reduce losses, and adopt modern techniques.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8 transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To create a self-sufficient and sustainable agricultural ecosystem where every 
                farmer has access to the best resources, technology, and market opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-700">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-green-50 rounded-xl p-6 text-center transform transition duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <HandshakeIcon className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fair Trade</h3>
              <p className="text-gray-700">
                Ensuring farmers get the best prices for their produce.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 text-center transform transition duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-700">
                Promoting eco-friendly and modern farming techniques.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 text-center transform transition duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-700">
                Using technology to make farming easier and more profitable.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 text-center transform transition duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-700">
                Connecting farmers with experts, buyers, and each other.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features & Offerings Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features & Offerings</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-700">
              What farmers can do with KisanMitra
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-5 p-6 bg-white rounded-xl shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="rounded-full bg-green-100 p-3 flex-shrink-0">
                <ShoppingCart className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Buy & Sell Crops</h3>
                <p className="text-gray-700">
                  A direct marketplace for farmers and buyers, cutting out middlemen to ensure better profits.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-5 p-6 bg-white rounded-xl shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="rounded-full bg-green-100 p-3 flex-shrink-0">
                <Users className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Guidance</h3>
                <p className="text-gray-700">
                  Access to agricultural experts for advice on crop selection, pest control, and more.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-5 p-6 bg-white rounded-xl shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="rounded-full bg-green-100 p-3 flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Weather & Market Insights</h3>
                <p className="text-gray-700">
                  Predictive analytics to help farmers make informed decisions about planting and harvesting.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-5 p-6 bg-white rounded-xl shadow-md transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="rounded-full bg-green-100 p-3 flex-shrink-0">
                <GraduationCap className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Modern Techniques & Training</h3>
                <p className="text-gray-700">
                  Resources on sustainable farming practices to increase yield while protecting the environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join Us CTA Section */}
      <section className="py-16 bg-green-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Growing Community</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Be part of the agricultural revolution. Connect with other farmers, access markets,
            and grow your farming business with KisanMitra.
          </p>
          <a 
            href="/register" 
            className="inline-block px-8 py-3 bg-white text-green-700 font-medium rounded-full hover:bg-green-50 transition-colors shadow-md"
          >
            Get Started Today
          </a>
        </div>
      </section>
      
   
    </div>
    </>
  );
};

export default AboutUs;