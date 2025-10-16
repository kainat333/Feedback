const feedbackQuestions = [
  { question: "How easy was it to use AimNexus.ai?", type: "rating" },
  { question: "Is the CV builder user-friendly?", type: "rating" },
  { question: "Was the registration process smooth?", type: "rating" },
  { question: "Which features did you like the most?", type: "text" },
  { question: "What improvements would you suggest?", type: "text" },
  {
    question: "Would you recommend AimNexus.ai to others?",
    type: "checkbox",
    options: ["Yes", "No"],
  },
];

export default feedbackQuestions;
