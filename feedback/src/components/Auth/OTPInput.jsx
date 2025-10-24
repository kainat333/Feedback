import React, { useRef } from "react";

const OTPInput = ({ otp, setOtp, isLoading, error }) => {
  // ✅ Add error prop
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-gray-600 text-sm mb-4">
          Enter the 6-digit code sent to your email
        </p>

        {/* ✅ Show error message if exists */}
        {error && (
          <p className="text-red-500 text-sm mb-4 font-sans">{error}</p>
        )}

        <div className="flex justify-between mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-10 h-10 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans ${
                error ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OTPInput;
