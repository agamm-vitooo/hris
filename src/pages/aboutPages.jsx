import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Carousel Section */}
      <div className="relative">
        <div className="carousel w-full overflow-hidden">
          <div className="carousel-item h-80 bg-cover bg-center bg-[url('/path/to/image1.jpg')] flex items-center justify-center">
            <h2 className="text-white text-4xl font-bold bg-black bg-opacity-50 p-4 rounded">
              Empowering Innovation Every Day
            </h2>
          </div>
          <div className="carousel-item h-80 bg-cover bg-center bg-[url('/path/to/image2.jpg')] flex items-center justify-center">
            <h2 className="text-white text-4xl font-bold bg-black bg-opacity-50 p-4 rounded">
              Transforming Ideas Into Reality
            </h2>
          </div>
          <div className="carousel-item h-80 bg-cover bg-center bg-[url('/path/to/image3.jpg')] flex items-center justify-center">
            <h2 className="text-white text-4xl font-bold bg-black bg-opacity-50 p-4 rounded">
              Building a Sustainable Future
            </h2>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button className="w-3 h-3 bg-white rounded-full"></button>
          <button className="w-3 h-3 bg-gray-400 rounded-full"></button>
          <button className="w-3 h-3 bg-gray-400 rounded-full"></button>
        </div>
      </div>

      {/* About Us Section */}
      <section className="py-12 px-6 md:px-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">About Us</h2>
        <p className="text-lg text-center max-w-3xl mx-auto mb-8">
          We are a company dedicated to delivering top-tier solutions through creativity,
          collaboration, and excellence. Our mission is to transform ideas into reality
          and create a lasting impact in the industries we serve.
        </p>

        {/* Core Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Who We Are</h3>
            <p>
              Established in [year], we have grown into a trusted name in [industry]. Our
              values of integrity, sustainability, and innovation guide everything we do.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">What We Do</h3>
            <p>
              We specialize in providing [specific services/products]. From [service 1] to
              [service 2], we are committed to delivering exceptional results for our
              clients.
            </p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-center mb-6">What Our Clients Say</h3>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="bg-white p-6 shadow-md rounded-lg max-w-md">
              <p className="italic">
                "The team at [Company Name] exceeded our expectations! Their dedication
                and expertise truly stand out."
              </p>
              <p className="text-right mt-4 font-semibold">- Client Name</p>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg max-w-md">
              <p className="italic">
                "Working with [Company Name] was a fantastic experience. Their innovative
                solutions helped us achieve our goals."
              </p>
              <p className="text-right mt-4 font-semibold">- Client Name</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
