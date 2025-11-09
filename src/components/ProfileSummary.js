const ProfileSummary = ({ language, currentUser }) => {
    const profileData = [
      {
        label: language === "en" ? "Class Year" : language === "hi" ? "कक्षा वर्ष" : "வகுப்பு ஆண்டு",
        value: currentUser?.classYear || (language === "en" ? "2nd Year" : language === "hi" ? "2nd वर्ष" : "2வது ஆண்டு"),
      },
      {
        label: language === "en" ? "Category" : language === "hi" ? "श्रेणी" : "வகை",
        value: currentUser?.category || "OBC",
      },
      {
        label: language === "en" ? "Family Income" : language === "hi" ? "पारिवारिक आय" : "குடும்ப வருமானம்",
        value: currentUser?.familyIncome || "₹1,80,000",
      },
      {
        label: language === "en" ? "District" : language === "hi" ? "जिला" : "மாவட்டம்",
        value: currentUser?.district || "Chennai",
      },
    ]
  
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {language === "en" ? "Profile Summary" : language === "hi" ? "प्रोफ़ाइल सारांश" : "சுயவிவர சுருக்கம்"}
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {profileData.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="font-medium text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default ProfileSummary
  