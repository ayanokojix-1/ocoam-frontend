import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

// Never throws — always resolves to a normalized { status, message } shape,
// even on a network failure or an unexpected server response.
async function handleLogin(formData) {
  const baseURL = import.meta.env.VITE_API_URL;

  try {
    const response = await axios.post(`${baseURL}/auth/login`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    if (error.request) {
      return {
        status: 0,
        message: "Can't reach the server. Check your internet connection and try again.",
      };
    }
    return { status: 0, message: "Something went wrong. Please try again." };
  }
}

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [isTechnicalIssue, setIsTechnicalIssue] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
    if (formError) setFormError("");
    if (isTechnicalIssue) setIsTechnicalIssue(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempError = {};

    if (formData.username === "") {
      tempError.username = "Username is required";
    }
    if (formData.password === "") {
      tempError.password = "Password is required";
    }

    if (Object.keys(tempError).length > 0) {
      setError(tempError);
      return;
    }

    setFormError("");
    setIsTechnicalIssue(false);
    setLoading(true);
    const output = await handleLogin(formData);
    setLoading(false);

    if (output.status === 200) {
      if (output.moderator) {
        navigate("/moderator/dashboard");
      } else {
        navigate("/form");
      }
      return;
    }

    if (output.status === 403) {
      setRedirecting(true);
      setFormError(output.message || "Please verify your email before logging in.");
      setTimeout(() => navigate("/verify-email"), 1500);
      return;
    }

    // 400 (bad credentials / missing fields), 500, or network failure (0) —
    // the backend gives one generic message for wrong username/password, so
    // this is shown as a form-level notice rather than blamed on one field.
    setFormError(output.message || "Unable to log in right now. Please try again.");
    // Only point people at the website-issue contact for actual technical
    // failures (server error / unreachable) — not a plain wrong password.
    setIsTechnicalIssue(output.status === 0 || output.status === 500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.img
            src="/logo.png"
            alt="Oduduwa College of Yoruba Medicine"
            className="w-16 h-16 rounded-full border-2 border-green-100 select-none pointer-events-none mb-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <h1 className="text-center select-none font-bold text-xl text-green-900">
            Welcome Back
          </h1>
          <p className="text-center text-sm text-gray-500 mt-1">
            Log in to your OCOYAM account
          </p>
        </div>

        {formError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p>{formError}</p>
              {isTechnicalIssue && (
                <p className="mt-1 text-red-600">
                  Website issue? Message us: <span className="font-mono">+234 807 376 5008</span>
                </p>
              )}
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="username or email address"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                error.username ? "border-red-400" : "border-gray-200"
              }`}
            />
            {error.username && (
              <p className="text-red-500 text-xs mt-1">{error.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pr-10 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                  error.password ? "border-red-400" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error.password && (
              <p className="text-red-500 text-xs mt-1">{error.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || redirecting}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-700 text-white font-semibold py-2.5 hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : redirecting ? (
              "Redirecting..."
            ) : (
              "Log In"
            )}
          </button>

          <div className="flex justify-between text-sm pt-1">
            <a href="/signup" className="text-green-700 font-medium hover:text-green-900">
              New here? Get started
            </a>
            <a href="/forgot-password" className="text-green-700 font-medium hover:text-green-900">
              Forgot password?
            </a>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
