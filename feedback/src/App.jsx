import "./App.css";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const routing = useRoutes(routes);
  return <AuthProvider>{routing}</AuthProvider>;
}
export default App;
