import { useState } from "react";

const useSignInForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    console.log("🔍 Form validation result:", { valid, errors: newErrors });
    return valid;
  };

  return {
    formData,
    errors,
    handleChange,
    validate,
    setFormData,
    setErrors,
  };
};

export default useSignInForm;
