import React from "react";
import { Link } from "react-router-dom";

const AuthFooter = ({ text, linkText, linkTo }) => {
  return (
    <div className="text-center text-gray-600 text-sm mt-6 pt-4 border-t border-gray-200">
      <p className="font-sans">
        {text}{" "}
        <Link
          to={linkTo}
          className="text-blue-800 hover:underline font-medium font-sans"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthFooter;
