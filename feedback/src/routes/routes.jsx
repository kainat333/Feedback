import FeedbackForm from "../pages/Feedback";

import PageNotFound from "../pages/PageNotFound";
import ResponseSubmitted from "../pages/REsponseSubmitted";
import PrivacyPolicy from "../pages/privacy";
import TermsAndConditions from "../pages/terms";
import ForgotPassword from "../pages/forgetpassword";
import ResetPassword from "../pages/resetpassword";
import RegisterForm from "../components/Forms/RegisterForm";
import SignIn_Form from "../components/Forms/SignIn_Form";
export const routes = [
  {
    path: "/",
    element: <RegisterForm />,
  },
  { path: "/response-submitted", element: <ResponseSubmitted /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <TermsAndConditions /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/signin",
    element: <SignIn_Form />,
  },
  {
    path: "/feedback",
    element: <FeedbackForm />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
];
