import React from 'react';
import { Phone, Mail, MapPin, Clock, Globe, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
          <p className="mb-6">
            We're here to help you succeed in your farming journey. Reach out to us through any of the channels below.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <Phone className="h-6 w-6 mr-4 mt-1" />
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p>+91 800-123-4567</p>
                <p>+91 900-765-4321</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-6 w-6 mr-4 mt-1" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <p>info@kisanmitra.com</p>
                <p>support@kisanmitra.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-6 w-6 mr-4 mt-1" />
              <div>
                <h4 className="font-semibold">Office Location</h4>
                <p>KisanMitra Technologies,</p>
                <p>Agri-Tech Park, Bangalore - 560100</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Business Hours</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Monday - Friday</p>
                <p className="text-gray-600">9:00 AM - 6:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Saturday</p>
                <p className="text-gray-600">10:00 AM - 4:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Sunday</p>
                <p className="text-gray-600">Closed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Additional Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Globe className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Regional Offices</p>
                <p className="text-gray-600">Available across all major farming regions in India</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Field Agents</p>
                <p className="text-gray-600">Our trained agents can visit your farm for personalized assistance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;