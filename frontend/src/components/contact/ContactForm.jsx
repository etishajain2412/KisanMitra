import React from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    alert("Message Sent Successfully! We'll get back to you soon.");
    reset();
  };

  return (
    <div className="shadow-lg max-w-2xl mx-auto p-6 bg-white rounded-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Send Us a Message</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name & Email Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="Your name"
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              placeholder="Your email address"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* Phone & Subject Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="Your phone number"
              {...register("phone")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Subject <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="How can we help you?"
              {...register("subject", { required: "Subject is required" })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
          </div>
        </div>

        {/* Message Field */}
        <div>
          <label className="block font-medium mb-1">Message <span className="text-red-500">*</span></label>
          <textarea
            placeholder="Tell us more about your inquiry..."
            rows={5}
            {...register("message", { required: "Message is required" })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center">
          <Send className="mr-2 h-5 w-5" /> Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
