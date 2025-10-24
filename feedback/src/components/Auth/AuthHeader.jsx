import React from "react";

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="flex items-center justify-center flex-col mb-6 text-left">
      <h1 className="text-2xl font-bold text-gray-800 font-sans">{title}</h1>
      <p className="text-gray-600 text-sm font-sans">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
