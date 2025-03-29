import React from 'react';
import Header from '../components/Header';
import ContactForm from '../components/contact/ContactForm';
import ContactInfo from '../components/contact/ContactInfo';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h2 className="text-base text-green-700 font-semibold tracking-wide uppercase">Contact Us</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Get in Touch with KisanMitra
            </p>
            <p className="mt-4 max-w-3xl text-xl text-gray-500 mx-auto">
              Have questions or need assistance? We're here to help you with all your farming needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;