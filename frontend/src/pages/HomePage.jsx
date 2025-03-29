import { Button } from "../components/ui/button";
import { Leaf, ArrowRight, Sun, Sprout } from "lucide-react";
import Footer from "../components/Footer"
import Header from "../components/Header"
const HomePage = () => {
  return (

    <div className="min-h-screen flex flex-col">
  <Header/>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gray-50 z-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">
                <Leaf className="h-4 w-4 mr-2" /> Empowering Indian Farmers
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Grow Better, <br />
                <span className="text-green-600">Live Better</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                KisanMitra connects farmers with resources, knowledge, and markets to 
                improve agricultural yield and quality of life across rural India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  Learn How It Works
                </Button>
              </div>
              <div className="flex items-center pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={`https://source.unsplash.com/collection/1346951/100x100?sig=${i}`} 
                        alt="Farmer" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-700">
                    Trusted by <span className="text-green-600 font-bold">10,000+</span> farmers
                  </p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-green-100 rounded-2xl -rotate-3"></div>
              <img 
                src="https://source.unsplash.com/photo-1523741543316-beb7fc7023d8" 
                alt="Happy Indian farmer in field" 
                className="rounded-2xl shadow-xl object-cover w-full h-[460px] rotate-3 relative z-10"
              />
              
              <div className="absolute -bottom-6 -left-6 bg-white py-3 px-4 rounded-lg shadow-lg flex items-center z-20">
                <div className="bg-yellow-50 p-2 rounded-full mr-3">
                  <Sun className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Weather Forecasts</p>
                  <p className="text-sm font-medium">Plan your crops better</p>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white py-3 px-4 rounded-lg shadow-lg flex items-center z-20">
                <div className="bg-green-50 p-2 rounded-full mr-3">
                  <Sprout className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Crop Advisory</p>
                  <p className="text-sm font-medium">Expert farming tips</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Farmers Helped" },
              { number: "500+", label: "Villages Covered" },
              { number: "25%", label: "Yield Increase" },
              { number: "₹15K+", label: "Avg. Income Growth" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{stat.number}</h3>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     <Footer/>
    </div>
  );
};

export default HomePage;