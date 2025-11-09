"use client"

const Sidebar = ({ currentPage, setCurrentPage, language, currentUser, isOpen = false, onClose = () => {} }) => {
  // Check if user is institution
  const isInstitution = currentUser?.role === 'institution';
  
  const menuItems = isInstitution ? [
    // Institution-specific menu
    {
      id: "dashboard",
      icon: "🏠",
      label: language === "en" ? "Dashboard" : language === "hi" ? "डैशबोर्ड" : "முகப்பு",
    },
    {
      id: "institution-profile",
      icon: "🏫",
      label: language === "en" ? "Institution Profile" : language === "hi" ? "संस्थान प्रोफ़ाइल" : "நிறுவன சுயவிவரம்",
    },
    {
      id: "recommendations",
      icon: "🎯",
      label: language === "en" ? "Student Recommendations" : language === "hi" ? "छात्र सिफारिशें" : "மாணவர் பரிந்துரைகள்",
    },
    {
      id: "community",
      icon: "👥",
      label: language === "en" ? "Institution Community" : language === "hi" ? "संस्थान समुदाय" : "நிறுவன சமூகம்",
    },
    {
      id: "scholarships",
      icon: "🎓",
      label: language === "en" ? "Scholarships" : language === "hi" ? "छात्रवृत्ति" : "உதவித்தொகை",
    },
    {
      id: "faq",
      icon: "❓",
      label: language === "en" ? "FAQ" : language === "hi" ? "सामान्य प्रश्न" : "கேள்விகள்",
    },
  ] : [
    // Regular student menu
    {
      id: "dashboard",
      icon: "🏠",
      label: language === "en" ? "Dashboard" : language === "hi" ? "डैशबोर्ड" : "முகப்பு",
    },
    {
      id: "guidance",
      icon: "📋",
      label: language === "en" ? "Guidance" : language === "hi" ? "मार्गदर्शन" : "வழிகாட்டுதல்",
    },
    {
      id: "scholarships",
      icon: "🎓",
      label: language === "en" ? "Scholarships" : language === "hi" ? "छात्रवृत्ति" : "உதவித்தொகை",
    },
    {
      id: "recommendations",
      icon: "🎯",
      label: language === "en" ? "Recommendations" : language === "hi" ? "सिफारिशें" : "பரிந்துரைகள்",
    },
    {
      id: "profile",
      icon: "👤",
      label: language === "en" ? "Profile" : language === "hi" ? "प्रोफ़ाइल" : "சுயவிவரம்",
    },
    {
      id: "community",
      icon: "👥",
      label: language === "en" ? "Community" : language === "hi" ? "समुदाय" : "சமூகம்",
    },
    {
      id: "faq",
      icon: "❓",
      label: language === "en" ? "FAQ" : language === "hi" ? "सामान्य प्रश्न" : "கேள்விகள்",
    },
  ]

  const getPortalTitle = () => {
    switch (language) {
      case "hi":
        return "डीबीटी पोर्टल"
      case "ta":
        return "டிபிடி போர்ட்டல்"
      default:
        return "DBT Portal"
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-[1px] z-[100] transition-opacity md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed md:static z-[120] md:z-auto top-0 left-0 h-full md:h-auto w-72 md:w-64 bg-white border-r shadow-2xl md:shadow-none transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold">{getPortalTitle()}</h2>
          <button
            className="md:hidden w-9 h-9 inline-flex items-center justify-center rounded-lg border border-white/30 hover:bg-white/10"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors group ${
                currentPage === item.id
                  ? "bg-blue-50 text-blue-800 border-r-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className={`text-xl ${currentPage === item.id ? 'scale-110' : 'group-hover:scale-105'} transition-transform`}>{item.icon}</span>
              <span className="font-medium tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
