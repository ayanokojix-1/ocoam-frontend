import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CountrySelect from "./country";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import parsePhoneNumber from "libphonenumber-js";
import { motion } from "framer-motion";

// Never throws — always resolves to a normalized { status, message } shape,
// even on a network failure or an unexpected server response.
async function handleSignup(formData) {
  const baseURL = import.meta.env.VITE_API_URL;

  try {
    const response = await axios.post(`${baseURL}/auth/signup`, formData);
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

const inputClass = (hasError) =>
  `w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
    hasError ? "border-red-400" : "border-gray-200"
  }`;

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    username: "",
    password: "",
    education_level: "",
    dob: "",
    address: "",
    gender: "",
    country: "",
    state: "",
    phone_number: "",
  });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    education_level: "",
    dob: "",
    address: "",
    gender: "",
    country: "",
    state: "",
    phone_number: "",
  });
  const [formError, setFormError] = useState("");
  const [isTechnicalIssue, setIsTechnicalIssue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset error
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
    if (formError) setFormError("");
    if (isTechnicalIssue) setIsTechnicalIssue(false);

    // Check age if it's the dob field
    if (name === "dob") {
      const selectedDate = new Date(value);
      const today = new Date();

      let age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      const dayDiff = today.getDate() - selectedDate.getDate();

      if (
        age < 18 ||
        (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
      ) {
        setError((prev) => ({
          ...prev,
          dob: "You must be at least 18 years old",
        }));
      }
    }

    if (name === "phone_number") {
      if (value.includes("+")) {
        try {
          const phoneNumber = parsePhoneNumber(value);
          if (!phoneNumber?.isValid()) {
            setError((prev) => ({
              ...prev,
              phone_number: "Please use a valid phone number",
            }));
          }
        } catch (err) {
          setError((prev) => ({
            ...prev,
            phone_number: "Please use a valid phone number",
          }));
        }
      } else {
        setError((prev) => ({
          ...prev,
          phone_number: "Please add your country code e.g., +2348123456789",
        }));
      }
    }
  };

  const handleCountryChange = (selectedCountry) => {
    setFormData((prev) => ({ ...prev, country: selectedCountry }));
    setError((prev) => ({ ...prev, country: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempError = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "username",
      "password",
      "education_level",
      "dob",
      "address",
      "gender",
      "country",
      "state",
      "phone_number",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field] === "") {
        tempError[field] = `${field.replace("_", " ")} is required`;
      }
    });

    if (Object.keys(tempError).length > 0) {
      setError(tempError);
      setFormError("Please fill in all required fields.");
      return;
    }

    // Catch anything the inline validators already flagged (e.g. an
    // invalid phone number) that would otherwise slip through silently.
    const existingErrors = Object.values(error).filter(Boolean);
    if (existingErrors.length > 0) {
      setFormError("Please fix the highlighted fields before continuing.");
      return;
    }

    const fullName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim();

    const payload = {
      ...formData,
      fullName,
      firstName: "",
      lastName: "",
    };

    setFormError("");
    setIsTechnicalIssue(false);
    setLoading(true);
    localStorage.setItem("email", payload.email);

    const results = await handleSignup(payload);
    setLoading(false);

    if (results.status === 201) {
      navigate("/verify-email");
      return;
    }

    if (results.status === 409) {
      setFormError(results.message);
      if (results.message?.toLowerCase().includes("username")) {
        setError((prev) => ({ ...prev, username: results.message }));
      } else {
        setError((prev) => ({ ...prev, email: results.message }));
      }
      return;
    }

    // 400 (missing fields), 500, or network failure (0)
    setFormError(results.message || "Something went wrong. Please try again.");
    // Only point people at the website-issue contact for actual technical
    // failures (server error / unreachable) — not a plain missing field.
    setIsTechnicalIssue(results.status === 0 || results.status === 500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md my-8"
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
            Create Your Account
          </h1>
          <p className="text-center text-sm text-gray-500 mt-1">
            Join Oduduwa College of Yoruba Medicine
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

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Personal Information */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-green-700">
              Personal Information
            </h2>
            <div className="flex gap-3">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClass(error.firstName)}
                />
                {error.firstName && <p className="text-red-500 text-xs mt-1">{error.firstName}</p>}
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClass(error.lastName)}
                />
                {error.lastName && <p className="text-red-500 text-xs mt-1">{error.lastName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={inputClass(error.dob)}
              />
              {error.dob && <p className="text-red-500 text-xs mt-1">{error.dob}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass(error.gender)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="none">I prefer not to say</option>
              </select>
              {error.gender && <p className="text-red-500 text-xs mt-1">{error.gender}</p>}
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-wide text-green-700 pt-3">
              Account Details
            </h2>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={inputClass(error.email)}
              />
              {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className={inputClass(error.username)}
              />
              {error.username && <p className="text-red-500 text-xs mt-1">{error.username}</p>}
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputClass(error.password)} pr-10`}
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
              {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
            </div>

            <div>
              <label htmlFor="education_level" className="block text-sm font-semibold text-gray-700 mb-1">
                Education Level
              </label>
              <select
                id="education_level"
                name="education_level"
                value={formData.education_level}
                onChange={handleChange}
                className={inputClass(error.education_level)}
              >
                <option value="">Select education level</option>
                <option value="secondary school">Secondary School</option>
                <option value="first degree">First Degree</option>
                <option value="masters">Masters</option>
                <option value="phd">PhD</option>
                <option value="retiree">Retiree</option>
              </select>
              {error.education_level && (
                <p className="text-red-500 text-xs mt-1">{error.education_level}</p>
              )}
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-wide text-green-700 pt-3">
              Location &amp; Contact
            </h2>
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
                Address
              </label>
              <input
                id="address"
                type="text"
                name="address"
                placeholder="Street address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass(error.address)}
              />
              {error.address && <p className="text-red-500 text-xs mt-1">{error.address}</p>}
            </div>

            <div>
              <CountrySelect value={formData.country} onChange={handleCountryChange} />
              {error.country && <p className="text-red-500 text-xs mt-1">{error.country}</p>}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1">
                State
              </label>
              <input
                id="state"
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className={inputClass(error.state)}
              />
              {error.state && <p className="text-red-500 text-xs mt-1">{error.state}</p>}
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone_number"
                type="tel"
                name="phone_number"
                placeholder="+2348123456789"
                value={formData.phone_number}
                onChange={handleChange}
                className={inputClass(error.phone_number)}
              />
              {error.phone_number && <p className="text-red-500 text-xs mt-1">{error.phone_number}</p>}
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm pt-1">
            <input type="checkbox" name="terms" required className="mt-1" />
            <p>
              By clicking this, you accept the{" "}
              <a href="/terms" className="text-green-700 font-medium hover:text-green-900">
                Terms and Conditions
              </a>{" "}
              of the website.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-700 text-white font-semibold py-2.5 hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="flex justify-center mt-5">
          <a href="/login" className="text-sm text-green-700 font-medium hover:text-green-900">
            Already have an account? Log in here
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
