import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import feedbackQuestions from "../feedback-questions";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const navigate = useNavigate();
  const { user, token, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      toast.error("Session expired. Please sign in again.");
      navigate("/signin");
    }
  }, [loading, isAuthenticated, navigate]);

  const currentPageQuestions = feedbackQuestions.filter(
    (q) => q.page === String(currentPage)
  );

  const handleChange = (questionId, value) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateCurrentPage = () => {
    const currentQuestions = feedbackQuestions.filter(
      (q) => q.page === String(currentPage)
    );

    const unanswered = currentQuestions.filter((q) => {
      const answer = formData[q.question];
      if (q.type === "checkbox") {
        return !answer;
      }
      return !answer || (typeof answer === "string" && answer.trim() === "");
    });

    if (unanswered.length > 0) {
      toast.error("Please answer all required questions on this page.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCurrentPage()) return;

    const answersArray = feedbackQuestions.map((q) => ({
      question: q.question,
      answer: formData[q.question] || "",
    }));

    try {
      const response = await fetch(
        "http://localhost:5000/api/feedback/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers: answersArray }),
        }
      );

      if (response.status === 401) {
        toast.error("Session expired. Please sign in again.");
        navigate("/signin");
        return;
      }

      if (response.ok) {
        toast.success("Feedback submitted successfully!");
        navigate("/response-submitted");
      } else {
        const data = await response.json();
        toast.error("Submission failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
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
              <span className="font-medium text-gray-900">{user.email}</span>{" "}
              <span className="text-gray-500">(Signed in)</span>
            </div>
            <a
              href="/signin"
              className="text-gray-900 text-xs font-medium hover:underline"
            >
              Switch account
            </a>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex justify-between items-center">
          <span>
            {currentPage === 1
              ? "Your Overall Experience"
              : currentPage === 2
              ? "Platform Usability & Design"
              : "Suggestions & Final Thoughts"}
          </span>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentPageQuestions.map((question) => {
            const globalIndex = feedbackQuestions.findIndex(
              (q) => q.question === question.question
            );

            return (
              <div
                key={question.question}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition-all bg-gray-50"
              >
                <label className="block text-left text-gray-900 font-medium text-sm mb-2">
                  {globalIndex + 1}. {question.question}{" "}
                  <span className="text-red-500">*</span>
                </label>

                {question.type === "text" && (
                  <input
                    type="text"
                    value={formData[question.question] || ""}
                    onChange={(e) =>
                      handleChange(question.question, e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    placeholder="Your answer"
                  />
                )}

                {question.type === "textarea" && (
                  <textarea
                    value={formData[question.question] || ""}
                    onChange={(e) =>
                      handleChange(question.question, e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    rows={4}
                    placeholder="Your detailed feedback"
                  />
                )}

                {question.type === "rating" && (
                  <div className="space-y-2 mt-2">
                    {["Excellent", "Good", "Satisfactory", "Poor"].map(
                      (opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-200 cursor-pointer text-sm transition-colors"
                        >
                          <input
                            type="radio"
                            name={`rating-${question.question}`}
                            checked={formData[question.question] === opt}
                            onChange={() =>
                              handleChange(question.question, opt)
                            }
                            className="accent-black w-4 h-4"
                          />
                          <span className="text-gray-900">{opt}</span>
                        </label>
                      )
                    )}
                  </div>
                )}

                {question.type === "checkbox" && (
                  <div className="space-y-2 mt-2">
                    {question.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-200 cursor-pointer text-sm transition-colors"
                      >
                        <input
                          type="radio"
                          name={`checkbox-${question.question}`}
                          checked={formData[question.question] === opt}
                          onChange={() => handleChange(question.question, opt)}
                          className="accent-black w-4 h-4"
                        />
                        <span className="text-gray-900">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-center gap-6 mt-10 p-4 bg-gray-100 rounded-lg shadow-inner">
            {currentPage > 1 && (
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage - 1)}
                className="w-36 bg-gray-900 text-white px-5 py-2 rounded-lg shadow-md hover:bg-black transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-700"
              >
                Previous
              </button>
            )}

            {currentPage < totalPages ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (validateCurrentPage()) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                className="w-36 bg-gray-900 text-white px-5 py-2 rounded-lg shadow-md hover:bg-black transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="w-36 bg-black text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-900 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-800"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
