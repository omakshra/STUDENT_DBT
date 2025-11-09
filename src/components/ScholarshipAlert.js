const ScholarshipAlert = ({ language }) => {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-red-800">
              {language === "en"
                ? "You're missing ₹45,000!"
                : language === "hi"
                  ? "आप ₹45,000 से चूक रहे हैं!"
                  : "நீங்கள் ₹45,000 இழக்கிறீர்கள்!"}
            </h4>
            <p className="text-sm text-red-700 mt-1">
              {language === "en"
                ? "Complete your DBT seeding to unlock eligible scholarships"
                : language === "hi"
                  ? "योग्य छात्रवृत्ति को अनलॉक करने के लिए अपना डीबीटी सीडिंग पूरा करें"
                  : "தகுதியான உதவித்தொகைகளை திறக்க உங்கள் டிபிடி விதைப்பை முடிக்கவும்"}
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  export default ScholarshipAlert
  