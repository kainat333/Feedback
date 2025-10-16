import React from "react";

const ResponseSubmitted = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white border border-gray-200 shadow-md rounded-lg p-10 text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Response Submitted
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your feedback! Your response has been successfully
          recorded.
        </p>
      </div>
    </div>
  );
};

export default ResponseSubmitted;
