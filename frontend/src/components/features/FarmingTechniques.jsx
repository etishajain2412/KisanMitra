import React from 'react';
import { Leaf, ShieldCheck, Sprout } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const FarmingTechniques = () => {
  const techniques = [
    {
      title: "Organic Farming",
      icon: <Leaf className="h-10 w-10 text-green-500" />,
      description: "Learn chemical-free farming methods that promote soil health and biodiversity while producing premium-quality crops.",
      benefits: ["Premium market prices", "Reduced input costs", "Healthier soil"]
    },
    {
      title: "Integrated Pest Management",
      icon: <ShieldCheck className="h-10 w-10 text-green-500" />,
      description: "Control pests effectively while minimizing environmental impact through biological controls and targeted interventions.",
      benefits: ["Less pesticide use", "Ecosystem preservation", "Healthier produce"]
    },
    {
      title: "Climate-Smart Agriculture",
      icon: <Sprout className="h-10 w-10 text-green-500" />,
      description: "Adapt to changing climate conditions with farming practices that build resilience and reduce greenhouse gas emissions.",
      benefits: ["Weather resilience", "Reduced carbon footprint", "Sustainable yields"]
    }
  ];

  return (
    <div className="py-16 border-t border-gray-100">
      <div className="space-y-6 text-center mb-12">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <Leaf className="h-4 w-4 mr-2" />
          Farming Techniques
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Modern and Sustainable Practices</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Access resources and guidance on implementing sustainable farming techniques that improve yields while preserving the environment.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {techniques.map((technique, index) => (
          <Card key={index} className="hover:shadow-lg transition-all h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex justify-center mb-4">
                {technique.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">{technique.title}</h3>
              <p className="text-gray-600 mb-6 text-center">{technique.description}</p>
              <div className="mt-auto">
                <h4 className="font-medium text-center mb-2">Key Benefits:</h4>
                <ul className="space-y-2">
                  {technique.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center justify-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FarmingTechniques;