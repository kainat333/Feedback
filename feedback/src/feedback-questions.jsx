const feedbackQuestions = [
  // Page 1: General Experience
  {
    question: "How easy was it to use AimNexus.ai?",
    type: "rating",
    page: "1",
  },
  { question: "Is the CV builder user-friendly?", type: "rating", page: "1" },
  {
    question: "Was the registration process smooth?",
    type: "rating",
    page: "1",
  },
  {
    question: "Which features did you like the most?",
    type: "text",
    page: "1",
  },
  {
    question: "How would you rate your overall experience with AimNexus.ai?",
    type: "rating",
    page: "1",
  },

  // Page 2: Usability & Design
  {
    question: "Was the platform easy to navigate and understand?",
    type: "text",
    page: "2",
  },
  {
    question: "Did the interface feel modern and user-friendly?",
    type: "rating",
    page: "2",
  },
  {
    question: "How quickly were you able to find the tools you needed?",
    type: "text",
    page: "2",
  },
  {
    question: "Is interview feature boost your confidence?",
    type: "checkbox",
    options: ["Yes", "No"],
    page: "2",
  },
  {
    question: "Would you recommend AimNexus.ai to others?",
    type: "checkbox",
    options: ["Yes", "No"],
    page: "2",
  },

  // Page 3: Suggestions & Impact
  { question: "What improvements would you suggest?", type: "text", page: "3" },
  {
    question:
      "Did AimNexus.ai help you feel more confident about your career path?",
    type: "checkbox",
    options: ["Yes", "No"],
    page: "3",
  },
  {
    question:
      "Have you applied to any opportunities discovered through the platform?",
    type: "text",
    page: "3",
  },
  {
    question: "How likely are you to continue using AimNexus.ai in the future?",
    type: "rating",
    page: "3",
  },
  {
    question: "Any final thoughts or feedback you'd like to share?",
    type: "text",
    page: "3",
  },
];

export default feedbackQuestions;
