import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BiRefresh } from "react-icons/bi";

const ErrorHandler = ({ statusCode, message }) => {
  const errors = {
    400: {
      title: "Bad Request",
      description: "Oops! Something went wrong with your request.",
    },
    404: {
      title: "Page Not Found",
      description: "Sorry, the page you are looking for does not exist.",
    },
    500: {
      title: "Server Error",
      description: "Sorry, the page you are looking for does not exist.",
    },
  };

  const currentError = errors[statusCode] || {
    title: "Error",
    description: "An unexpected error occurred.",
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-midnight px-4"
    >
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-bold text-blue-500 mb-8"
        >
          {statusCode}
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-4">
          {currentError.title}
        </h1>
        <p className="text-gray-400 mb-8">
          {message || currentError.description}
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors group"
          >
            <BiRefresh className="w-5 h-5 mr-2 group-hover:animate-spin" />
            Refresh
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorHandler;
