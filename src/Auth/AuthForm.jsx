import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css"; // Import CSS file
import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithCustomToken } from "firebase/auth";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Hook for redirection
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      if (isLogin) {
        // use api to login
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        const userCredential = await signInWithCustomToken(auth, data.token);
        const idToken = await userCredential.user.getIdToken();

        localStorage.setItem("idToken", idToken);
        navigate("/home");
  
      } else {
        // use api to signup
        const response = await fetch(`${API_BASE_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Signup failed");
        }

        const userCredential = await signInWithCustomToken(auth, data.token);
        const idToken = await userCredential.user.getIdToken();

        localStorage.setItem("idToken", idToken);
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
  
      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // ✅ Get the ID token, not access token
      const idToken = await user.getIdToken();
  
      // ✅ Store ID token locally (for authenticated API use)
      localStorage.setItem("idToken", idToken);
  
      // ✅ Send ID token to your backend for verification
      const response = await fetch(`${API_BASE_URL}/google-signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // Optional: use as Bearer
        },
        body: JSON.stringify({ idToken }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to authenticate with backend");
      }
  
      console.log("Signed in and verified successfully");
      navigate("/home"); // Redirect to homepage after successful login  
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="auth-background">
        <div className="auth-content">
          <h1>Welcome to Password Manager</h1>
          <p>Securely manage your passwords with ease.</p>
        </div>
              
      <div className="auth-container">
        <div className="auth-box">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button className="submit-btn" type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          </form>

          {error && <p className="error">{error}</p>}

          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span className="toggle-link" onClick={toggleForm}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* Google Sign-In Button */}
          <button className="google-btn" onClick={handleGoogleSignIn}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
