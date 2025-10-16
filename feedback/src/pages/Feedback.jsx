import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import feedbackQuestions from "../feedback-questions";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({});
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
  };

  const handleCheckboxChange = (index, value) => {
    if (formData[index] === value) {
      const newFormData = { ...formData };
      delete newFormData[index];
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [index]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in first");
      navigate("/signin");
      return;
    }

    const unansweredQuestions = [];
    filteredQuestions.forEach((question, index) => {
      if (!formData[index] || formData[index].toString().trim() === "") {
        unansweredQuestions.push(index + 1);
      }
    });

    if (unansweredQuestions.length > 0) {
      toast.error("Please answer all required questions");
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
        toast.success("Feedback submitted successfully!");
        navigate("/response-submitted");
      } else {
        const data = await response.json();
        toast.error("Submission failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Something went wrong!");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-gray-600 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-6 px-3">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg border border-gray-200 p-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-1 bg-black rounded-tr-full"></div>
        <div className="absolute top-0 right-0 w-24 h-1 bg-black rounded-tl-full"></div>

        <div className="border-b border-gray-200 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Feedback Form
          </h1>
          <p className="text-gray-600 text-sm leading-snug">
            Please take a moment to share your thoughts. Your feedback helps{" "}
            <span className="font-semibold text-black">AimNexus</span> improve.
          </p>

          <div className="mt-3 text-xs text-gray-700 flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-200">
            <div>
              <span className="font-medium text-gray-800">{user.email}</span>{" "}
              <span className="text-gray-500">(Signed in)</span>
            </div>
            <a
              href="/signin"
              className="text-gray-900 text-xs font-medium hover:underline"
            >
              Switch account
            </a>
          </div>

          <p className="mt-1 text-xs text-red-500">
            * Indicates required question
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {filteredQuestions.map((q, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition-all bg-gray-50"
            >
              <label className="block text-left text-gray-800 font-medium text-sm mb-2">
                {q.question} <span className="text-red-500">*</span>
              </label>

              {q.type === "text" && (
                <input
                  type="text"
                  value={formData[index] || ""}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-full border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black outline-none px-3 py-1.5 text-gray-700 text-sm"
                  placeholder="Your answer"
                />
              )}

              {(q.type === "rating" ||
                q.type === "checkbox" ||
                q.type === "yesno") && (
                <div className="space-y-2 mt-2">
                  {satisfactionOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-100 transition-all cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={formData[index] === opt}
                        onChange={() => handleCheckboxChange(index, opt)}
                        className="accent-black w-4 h-4"
                      />
                      <span className="text-gray-800">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="text-left mt-6">
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-all shadow-sm text-sm"
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
