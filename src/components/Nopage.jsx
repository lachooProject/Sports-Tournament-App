import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BiErrorCircle } from "react-icons/bi";

const Nopage = () => {
  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Error Icon */}
        <div className="mb-8 animate-bounce">
          <BiErrorCircle className="text-8xl text-red-500 mx-auto" />
        </div>

        {/* Large 404 Text */}
        <h1
          className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 
          bg-clip-text text-transparent mb-4"
        >
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-white mb-6">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for seems to have vanished into thin air.
          Let's get you back on track!
        </p>

        {/* Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
            text-white font-semibold px-6 py-3 rounded-full transition-all duration-300
            hover:scale-105 shadow-lg"
        >
          <FaHome className="text-xl" />
          Back to Home
        </Link>

        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default Nopage;
