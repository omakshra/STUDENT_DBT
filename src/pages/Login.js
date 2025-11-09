import { useState } from "react";
import apiService from "../services/api";

const Login = ({ onLogin, language }) => {
  const [formData, setFormData] = useState({
    username: "",       // student ID or email
    password: "",
    role: "student",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { value: "student", label: language === "en" ? "Student" : "छात्र" },
    { value: "volunteer", label: language === "en" ? "Volunteer" : "स्वयंसेवक" },
    { value: "institution", label: language === "en" ? "Institution" : "संस्थान" },
    { value: "govt", label: language === "en" ? "Government Official" : "सरकारी अधिकारी" },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Trim inputs to avoid 422
      const username = formData.username.trim();
      const password = formData.password.trim();
      if (!username || !password) {
        setError(language === "en" ? "All fields are required." : "सभी फ़ील्ड आवश्यक हैं।");
        setIsLoading(false);
        return;
      }

      // Convert username to email if needed
      const email = username.includes("@") ? username : `${username}@example.com`;

      let response;
      if (isRegisterMode) {
        response = await apiService.register({
          name: username,
          email,
          password,
          role: formData.role,
        });
      } else {
        response = await apiService.login({
          email,
          password,
        });
      }

      // Normalize user object and ensure role is set
      const user = response.user || response; // make sure it's the actual user object
      const token = response.token || response.access_token; // match backend field
      
      // For login, we need to set the role from the form since backend might not return it
      if (!isRegisterMode && formData.role) {
        user.role = formData.role;
      }

      if (user && token) {
        onLogin(user, token); // passes both to App.js to store in localStorage
      } else {
        setError(language === "en" ? "Invalid credentials." : "अमान्य प्रमाण-पत्र।");
      }

      // Clear password field after submit
      setFormData({ ...formData, password: "" });
    } catch (err) {
      console.error("Login/Register error:", err);
      setError(
        language === "en"
          ? "Something went wrong. Please try again."
          : "कुछ गलत हो गया। कृपया पुनः प्रयास करें।"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          {isRegisterMode
            ? language === "en" ? "Create Account" : "खाता बनाएं"
            : language === "en" ? "DBT Student Portal" : "डीबीटी छात्र पोर्टल"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {language === "en"
            ? "Access scholarships, guidance, and community resources"
            : "छात्रवृत्ति, मार्गदर्शन और सामुदायिक संसाधनों तक पहुंचें"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                {language === "en" ? "username ID / Email" : "छात्र आईडी / ईमेल"}
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={language === "en" ? "Enter your student ID" : "अपना छात्र आईडी दर्ज करें"}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {language === "en" ? "Password" : "पासवर्ड"}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={language === "en" ? "Enter your password" : "अपना पासवर्ड दर्ज करें"}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                {language === "en" ? "Select Role" : "भूमिका चुनें"}
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              {formData.role === 'institution' && (
                <p className="mt-1 text-xs text-blue-600">
                  {language === "en" 
                    ? "🏫 Institution users will be redirected to complete their profile" 
                    : "🏫 संस्थान उपयोगकर्ताओं को उनकी प्रोफ़ाइल पूरी करने के लिए पुनर्निर्देशित किया जाएगा"
                  }
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? isRegisterMode ? "Creating account..." : "Signing in..."
                : isRegisterMode 
                  ? (formData.role === 'institution' ? "Create Institution Account" : "Create Account")
                  : (formData.role === 'institution' ? "Sign in as Institution" : "Sign in")}
            </button>
          </form>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isRegisterMode
                ? language === "en" ? "Already have an account? Sign in" : "पहले से खाता है? साइन इन करें"
                : language === "en" ? "Don't have an account? Create one" : "खाता नहीं है? एक बनाएं"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
