import { useState } from "react";

const useFormValidation = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    if (name === "fullName") {
      if (!value.trim()) error = "Full name is required";
      else if (value.length < 3)
        error = "Full name must be at least 3 characters";
    }
    if (name === "email") {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = "Email is required";
      else if (!pattern.test(value))
        error = "Please enter a valid email address";
    }
    if (name === "password") {
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!value.trim()) error = "Password is required";
      else if (!pattern.test(value))
        error =
          "Password must have 8+ characters, 1 uppercase, 1 lowercase & 1 number";
    }
    if (name === "acceptTerms" && !value)
      error = "You must accept our Terms and Privacy Policy";
    return error;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (showErrors && errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return {
    formData,
    errors,
    showErrors,
    setShowErrors,
    handleChange,
    validateAll,
    validateField,
  };
};

export default useFormValidation;
