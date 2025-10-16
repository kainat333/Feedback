import "./App.css";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // don't forget the CSS
function App() {
  const routing = useRoutes(routes);
  return (
    <AuthProvider>
      {routing}
      <ToastContainer
        position="top-right"
        autoClose={2000} // Show for 2 seconds
        hideProgressBar={true} // Hide the progress bar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Nice colored toast
      />
    </AuthProvider>
  );
}
export default App;
