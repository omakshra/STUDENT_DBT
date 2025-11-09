"use client"

import { useState } from "react"

const LanguageToggle = ({ language, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const languages = {
    en: "EN",
    hi: "हिं",
    ta: "தமிழ்",
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        {languages[language]}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-20 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {Object.entries(languages).map(([code, label]) => (
            <button
              key={code}
              onClick={() => {
                onLanguageChange(code) // ✅ uses correct prop
                setIsOpen(false)
              }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                language === code ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}

export default LanguageToggle
