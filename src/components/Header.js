"use client"

import { useState, useRef, useEffect } from "react"
import LanguageToggle from "./LanguageToggle"

const Header = ({
  currentUser,
  language,
  onLanguageChange,
  onLogout,
  onThemeToggle,
  isDarkMode,
  setCurrentPage,
  onSidebarToggle,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)

  const getTranslation = () => {
    const translations = {
      en: {
        portal: "DBT Portal",
        profile: "Profile",
        logout: "Logout",
        notifications: "Notifications",
        darkMode: "Dark Mode",
        lightMode: "Light Mode",
        welcome: "Welcome back",
        noNotifications: "No new notifications",
        viewProfile: "View Profile",
        editProfile: "Edit Profile",
      },
      hi: {
        portal: "डीबीटी पोर्टल",
        profile: "प्रोफ़ाइल",
        logout: "लॉग आउट",
        notifications: "सूचनाएं",
        darkMode: "डार्क मोड",
        lightMode: "लाइट मोड",
        welcome: "वापसी पर स्वागत",
        noNotifications: "कोई नई सूचना नहीं",
        viewProfile: "प्रोफ़ाइल देखें",
        editProfile: "प्रोफ़ाइल संपादित करें",
      },
      ta: {
        portal: "டிபிடி போர்ட்டல்",
        profile: "சுயவிவரம்",
        logout: "வெளியேறு",
        notifications: "அறிவிப்புகள்",
        darkMode: "இருண்ட பயன்முறை",
        lightMode: "ஒளி பயன்முறை",
        welcome: "மீண்டும் வரவேற்கிறோம்",
        noNotifications: "புதிய அறிவிப்புகள் இல்லை",
        viewProfile: "சுயவிவரத்தைப் பார்க்கவும்",
        editProfile: "சுயவிவரத்தைத் திருத்தவும்",
      },
    }
    return translations[language] || translations.en
  }

  const t = getTranslation()

  const mockNotifications = [
    {
      id: 1,
      title: "New Scholarship Available",
      message: "Engineering Excellence Award is now open for applications",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Profile Update Required",
      message: "Please update your bank details for DBT",
      time: "1 day ago",
      unread: true,
    },
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/90 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-[90]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            onClick={onSidebarToggle}
            className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow ring-1 ring-blue-400/30">
              <span className="text-white font-bold text-base sm:text-xl">DBT</span>
          </div>
          <div>
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">{t.portal}</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Government of India • Scholarship Services</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Welcome message */}
          <div className="hidden lg:block text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.welcome}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentUser?.name || "Student"}</p>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" className="hidden" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.5c0-3.038-1.857-5.622-4.5-6.59V5a3 3 0 10-6 0v.91C7.857 6.878 6 9.462 6 12.5v2.086c0 .53-.21 1.039-.586 1.414L4.5 17.914A1 1 0 005.207 19h13.586A1 1 0 0020.5 17.914l-.914-.914a2 2 0 01-.586-1.414V12.5zM9 19a3 3 0 006 0" />
              </svg>
              {mockNotifications.filter((n) => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {mockNotifications.filter((n) => n.unread).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t.notifications}
                  </h3>
                </div>
                <ul className="max-h-64 overflow-y-auto">
                  {mockNotifications.length === 0 ? (
                    <li className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                      {t.noNotifications}
                    </li>
                  ) : (
                    mockNotifications.map((note) => (
                      <li
                        key={note.id}
                        className="px-4 py-3 text-sm border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <p className="font-medium text-gray-900 dark:text-gray-100">{note.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{note.message}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{note.time}</p>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <LanguageToggle language={language} onLanguageChange={onLanguageChange} />

          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            title={isDarkMode ? t.lightMode : t.darkMode}
          >
            {isDarkMode ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <img
                src={currentUser?.avatar || "/placeholder.svg?height=40&width=40&query=student profile"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 shadow"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentUser?.name || "Student User"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.studentId || "STU001"}</p>
              </div>
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser?.avatar || "/placeholder.svg?height=48&width=48&query=student profile"}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{currentUser?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{currentUser?.university}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPage("profile")}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  👤 {t.viewProfile}
                </button>

                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-700 transition-colors flex items-center gap-2 text-red-600 dark:text-red-400"
                >
                  🚪 {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/** Secondary nav removed to avoid duplicate bar and visual clutter **/}
    </header>
  )
}

export default Header
