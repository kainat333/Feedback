import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";
const Client_id =
  "810170332987-9t4oigj4rbjas46do73ls65qpgl56rl4.apps.googleusercontent.com";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={Client_id}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
