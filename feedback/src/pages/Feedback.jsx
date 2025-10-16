import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import feedbackQuestions from "../feedback-questions";
import { useAuth } from "../context/AuthContext";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { user, token, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate("/signin");
    }
  }, [loading, isAuthenticated, navigate]);

  const filteredQuestions = feedbackQuestions.slice(0, -1);
  const satisfactionOptions = ["Excellent", "Good", "Satisfactory", "Poor"];

  const handleChange = (index, value) => {
    setFormData({ ...formData, [index]: value });
    // Clear validation error when user starts typing
    if (validationErrors[index]) {
      setValidationErrors({ ...validationErrors, [index]: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in first");
      navigate("/signin");
      return;
    }

    // Validate that all questions are answered
    const errors = {};
    const unansweredQuestions = [];
    filteredQuestions.forEach((question, index) => {
      if (!formData[index] || formData[index].trim() === "") {
        errors[index] = true;
        unansweredQuestions.push(index + 1);
      }
    });

    setValidationErrors(errors);

    if (unansweredQuestions.length > 0) {
      alert(
        `Please answer all required questions. Missing: Question ${unansweredQuestions.join(
          ", "
        )}`
      );
      return;
    }

    try {
      const answersArray = Object.keys(formData).map((index) => ({
        question: filteredQuestions[index].question,
        answer: formData[index],
      }));

      const response = await fetch(
        "http://localhost:5000/api/feedback/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: answersArray, userId: user.id }),
        }
      );

      if (response.ok || response.status === 204) {
        navigate("/response-submitted");
      } else {
        const data = await response.json();
        alert("Submission failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong!");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-1 bg-black rounded-tr-full"></div>
        <div className="absolute top-0 right-0 w-32 h-1 bg-black rounded-tl-full"></div>

        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Feedback Form
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Please take a moment to share your thoughts. Your feedback helps{" "}
            <span className="font-semibold text-black">AimNexus</span> improve
            and serve you better.
          </p>

          <div className="mt-5 text-sm text-gray-700 flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
            <div>
              <span className="font-medium text-gray-800">{user.email}</span>{" "}
              <span className="text-gray-500 text-xs">(Signed in)</span>
            </div>
            <a
              href="/signin"
              className="text-black text-xs font-medium hover:underline"
            >
              Switch account
            </a>
          </div>

          <p className="mt-2 text-xs text-red-500">
            * Indicates required question
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {filteredQuestions.map((q, index) => (
            <div
              key={index}
              className={`border rounded-xl p-6 shadow-sm hover:shadow-md transition-all ${
                validationErrors[index]
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <label className="block text-left text-gray-800 font-medium text-base mb-3">
                {q.question} <span className="text-red-500">*</span>
              </label>

              {q.type === "text" && (
                <input
                  type="text"
                  value={formData[index] || ""}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none px-4 py-2 text-gray-700 text-sm"
                  placeholder="Your answer"
                  required
                />
              )}

              {(q.type === "rating" ||
                q.type === "checkbox" ||
                q.type === "yesno") && (
                <div className="space-y-3 mt-4">
                  {satisfactionOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData[index] === opt}
                        onChange={() => handleChange(index, opt)}
                        className="accent-black w-5 h-5"
                      />
                      <span className="text-gray-800">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="text-left mt-10">
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-8 rounded-md transition-all shadow-md"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
