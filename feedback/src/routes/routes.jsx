import Register from "../pages/Register";
import FeedbackForm from "../pages/Feedback";
import SignIn_Form from "../pages/SigninForm";
import PageNotFound from "../pages/PageNotFound";
import ResponseSubmitted from "../pages/REsponseSubmitted";
import PrivacyPolicy from "../pages/privacy";
import TermsAndConditions from "../pages/terms";
import ForgotPassword from "../pages/forgetpassword";
import ResetPassword from "../pages/resetpassword";

export const routes = [
  {
    path: "/",
    element: <Register />,
  },
  { path: "/response-submitted", element: <ResponseSubmitted /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/terms", element: <TermsAndConditions /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/register",
    element: <Register />,
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
