const EligibleScholarships = ({ language }) => {
    const scholarships = [
      {
        name: language === "en" ? "Merit Scholarship" : language === "hi" ? "मेरिट छात्रवृत्ति" : "தகுதி உதவித்தொகை",
        amount: "₹20,000",
        deadline: "3/15/2025",
        type: "merit",
      },
      {
        name: language === "en" ? "Low-Income Grant" : language === "hi" ? "कम आय अनुदान" : "குறைந்த வருமான மானியம்",
        amount: "₹25,000",
        deadline: "4/30/2025",
        type: "need-based",
      },
    ]
  
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h3 className="text-lg font-semibold text-gray-800">
              {language === "en" ? "Eligible Scholarships" : language === "hi" ? "योग्य छात्रवृत्ति" : "தகுதியான உதவித்தொகைகள்"}
            </h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {scholarships.map((scholarship, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{scholarship.name}</h4>
                <p className="text-sm text-gray-600">{scholarship.amount}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{scholarship.deadline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default EligibleScholarships
  