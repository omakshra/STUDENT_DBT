"use client";

import { useState, useEffect } from "react";
import { TTSProvider } from "./contexts/TTSContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Guidance from "./pages/Guidance";
import Scholarships from "./pages/Scholarships";
import Community from "./pages/Community";
import FAQ from "./pages/FAQ";
import Recommendations from "./pages/Recommendations";
import StudentProfile from "./pages/StudentProfile";
import InstitutionDashboard from "./pages/InstitutionDashboard";
import InstitutionProfile from "./pages/InstitutionProfile";
import Login from "./pages/Login";
import Chatbot from "./components/Chatbot";
import apiService from "./services/api";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(apiService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(() => apiService.getCurrentUser());
  const [language, setLanguage] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const protectedPages = ["recommendations", "profile"];

  // --------------------------
  // Check auth & setup listeners
  // --------------------------
  useEffect(() => {
    const handleSessionExpired = () => {
      setSessionExpired(true);
      setIsLoggedIn(false);
      setCurrentUser(null);
      setShowLoginModal(false);
      setCurrentPage("dashboard");
    };

    window.addEventListener("sessionExpired", handleSessionExpired);

    // Reset session activity on user actions
    const resetActivity = () => {
      // Placeholder for session activity logic if needed
    };
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    activityEvents.forEach((event) => document.addEventListener(event, resetActivity, true));

    // Dark mode from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired);
      activityEvents.forEach((event) => document.removeEventListener(event, resetActivity, true));
    };
  }, []);

  // --------------------------
  // Show login modal for protected pages
  // --------------------------
  useEffect(() => {
    if (protectedPages.includes(currentPage) && !isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [currentPage, isLoggedIn]);

  // --------------------------
  // Handlers
  // --------------------------
  const handleLogin = (user, token) => {
  // Store token locally
  if (token) localStorage.setItem("access_token", token);
  if (user) localStorage.setItem("current_user", JSON.stringify(user));

  setIsLoggedIn(true);
  setCurrentUser(user);
  setSessionExpired(false);
  setShowLoginModal(false);
  
  // Redirect based on user role
  if (user.role === 'institution') {
    setCurrentPage('dashboard');
  } else {
    setCurrentPage('recommendations');
  }
};

  const handleLogout = () => {
    apiService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowLoginModal(false);
    setCurrentPage("dashboard");
    setSessionExpired(false);
  };

  const updateUserData = (userData) => {
    const updatedUser = apiService.updateUserData(userData);
    if (updatedUser) setCurrentUser(updatedUser);
  };

  const handleThemeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // --------------------------
  // Render pages
  // --------------------------
  const renderPage = () => {
    if (protectedPages.includes(currentPage) && !isLoggedIn) {
      return <Dashboard language={language} currentUser={currentUser} onPageChange={setCurrentPage} />;
    }

    // Check if user is institution
    const isInstitution = currentUser?.role === 'institution';

    switch (currentPage) {
      case "dashboard":
        return <Dashboard language={language} currentUser={currentUser} onPageChange={setCurrentPage} />;
      case "guidance":
        return <Guidance language={language} />;
      case "scholarships":
        return <Scholarships language={language} />;
      case "recommendations":
        return <Recommendations language={language} currentUser={currentUser} updateUserData={updateUserData} />;
      case "profile":
        // Institution users should not see student profile, redirect to institution profile
        if (isInstitution) {
          return <InstitutionProfile language={language} currentUser={currentUser} updateUserData={updateUserData} />;
        }

        
        return <StudentProfile language={language} currentUser={currentUser} updateUserData={updateUserData} />;
      case "institution":
        return <InstitutionDashboard language={language} currentUser={currentUser} />;
      case "institution-profile":
        return <InstitutionProfile language={language} currentUser={currentUser} updateUserData={updateUserData} />;
      case "community":
        return <Community language={language} currentUser={currentUser} />;
      case "faq":
        return <FAQ language={language} />;
      default:
        // Default redirect based on user role
        if (isInstitution) {
          return <Dashboard language={language} currentUser={currentUser} onPageChange={setCurrentPage} />;
        }
        return <Dashboard language={language} currentUser={currentUser} onPageChange={setCurrentPage} />;
    }
  };

  // --------------------------
  // JSX
  // --------------------------
  return (
    <TTSProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar (mobile overlay + desktop static) */}
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={(page) => {
            setCurrentPage(page);
            closeSidebar();
          }}
          language={language}
          currentUser={currentUser}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {!(protectedPages.includes(currentPage) && !isLoggedIn && showLoginModal) && (
            <Header
              currentUser={currentUser}
              language={language}
              onLogout={handleLogout}
              onLanguageChange={setLanguage}
              onThemeToggle={handleThemeToggle}
              isDarkMode={isDarkMode}
              setCurrentPage={setCurrentPage}
              onSidebarToggle={toggleSidebar}
            />
          )}
          <main className={`flex-1 p-6 ${showLoginModal ? "blur-sm" : ""}`}>
            {renderPage()}
          </main>
        </div>
        <Chatbot language={language} />

        {/* Login Modal */}
        {protectedPages.includes(currentPage) && !isLoggedIn && showLoginModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowLoginModal(false)}
          >
            <div
              className="relative bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Login Required
                </h2>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                >
                  ✕
                </button>
              </div>
              <Login onLogin={handleLogin} language={language} sessionExpired={sessionExpired} />
            </div>
          </div>
        )}
      </div>
    </TTSProvider>
  );
}

export default App;
