import React from "react";

const StockWiseLanding = () => {
  return (
    <div className="bg-white h-screen flex items-center justify-center">
      {/* Left Section */}
      <section className="w-full px-10 py-20 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <h1 className="text-5xl font-bold leading-tight">
          Transform Your <br /> <span className="text-teal-300">Inventory Management</span>
        </h1>
        <p className="text-lg mt-4">
          Streamline operations, reduce costs, and gain real-time insights
          with our powerful yet intuitive inventory management solution.
        </p>
        <div className="mt-6 flex gap-4">
          <button className="px-6 py-3 bg-white text-teal-800 font-semibold rounded-lg hover:bg-gray-200">
            Get Started
          </button>
       
        </div>
        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-3xl font-bold">99.9%</h3>
            <p className="text-sm text-gray-200">Accuracy Rate</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">42%</h3>
            <p className="text-sm text-gray-200">Cost Reduction</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">5,000+</h3>
            <p className="text-sm text-gray-200">Active Users</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">24/7</h3>
            <p className="text-sm text-gray-200">Support Available</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StockWiseLanding;
