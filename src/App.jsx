import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AuthForm from "./Auth/AuthForm";
import HomePage from "./Home/HomePage";
import ProtectedRoute from "./Auth/ProtectedRoute";
import RedirectIfLoggedIn from "./Auth/RedirectIfLoggedIn";

function App() {
  return (
    <Router>
      <Routes>
      <Route
          path="/"
          element={
            <RedirectIfLoggedIn>
              <AuthForm />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>404 Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
