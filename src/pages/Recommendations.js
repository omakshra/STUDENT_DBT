"use client"

import { useState, useEffect, useRef } from "react"
import apiService from "../services/api"
import scholarshipsData from "../data/Scholarship.json"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const Recommendations = ({ language, currentUser }) => {
  const componentRef = useRef()
  const [studentProfile, setStudentProfile] = useState(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("studentProfile")
      if (savedProfile) {
        try {
          return JSON.parse(savedProfile)
        } catch (e) {
          console.error("Failed to parse student profile from local storage:", e)
        }
      }
    }
    return currentUser || {}
  })

  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiConnected, setApiConnected] = useState(false)

  useEffect(() => {
    localStorage.setItem("studentProfile", JSON.stringify(studentProfile))
  }, [studentProfile])

  useEffect(() => {
    if (currentUser) {
      setStudentProfile(currentUser)
    }
  }, [currentUser])

  const t = (() => {
    const translations = {
      en: {
        title: "Scholarship Recommendations",
        subtitle: "Personalized scholarship matches based on your profile",
        downloadPDF: "Download PDF Report",
        loading: "Finding scholarships for you...",
        noRecommendations: "No scholarships found matching your profile",
        eligibilityScore: "Eligibility Score",
        amount: "Amount",
        deadline: "Deadline",
        provider: "Provider",
        category: "Category",
        requirements: "Requirements",
        whyMatch: "Why this matches you",
        applyNow: "Apply Now",
      },
      hi: {
        title: "छात्रवृत्ति सिफारिशें",
        subtitle: "आपकी प्रोफ़ाइल के आधार पर व्यक्तिगत छात्रवृत्ति मैच",
        downloadPDF: "पीडीएफ रिपोर्ट डाउनलोड करें",
        loading: "आपके लिए छात्रवृत्ति खोजी जा रही है...",
        noRecommendations: "आपकी प्रोफ़ाइल से मेल खाने वाली कोई छात्रवृत्ति नहीं मिली",
        eligibilityScore: "योग्यता स्कोर",
        amount: "राशि",
        deadline: "अंतिम तिथि",
        provider: "प्रदाता",
        category: "श्रेणी",
        requirements: "आवश्यकताएं",
        whyMatch: "यह आपसे क्यों मेल खाता है",
        applyNow: "अभी आवेदन करें",
      },
      ta: {
        title: "உதவித்தொகை பரிந்துரைகள்",
        subtitle: "உங்கள் சுயவிவரத்தின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட உதவித்தொகை பொருத்தங்கள்",
        downloadPDF: "PDF அறிக்கையைப் பதிவிறக்கவும்",
        loading: "உங்களுக்கான உதவித்தொகைகளைத் தேடுகிறது...",
        noRecommendations: "உங்கள் சுயவிவரத்துடன் பொருந்தும் உதவித்தொகைகள் எதுவும் கிடைக்கவில்லை",
        eligibilityScore: "தகுதி மதிப்பெண்",
        amount: "தொகை",
        deadline: "கடைசி தேதி",
        provider: "வழங்குநர்",
        category: "வகை",
        requirements: "தேவைகள்",
        whyMatch: "இது ஏன் உங்களுக்குப் பொருந்துகிறது",
        applyNow: "இப்போது விண்ணப்பிக்கவும்",
      },
    }
    return translations[language] || translations.en
  })()

  const getRecommendations = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      let matchedScholarships = scholarshipsData
      const age = new Date().getFullYear() - new Date(studentProfile.dob).getFullYear()

      matchedScholarships = matchedScholarships
        .map((scholarship) => {
          let eligibilityScore = 0
          const matchReasons = []

          if (age >= scholarship.ageRange[0] && age <= scholarship.ageRange[1]) {
            eligibilityScore += 20
            matchReasons.push(`Matches age range (${scholarship.ageRange[0]}-${scholarship.ageRange[1]})`)
          }

          if (scholarship.gender === "any" || scholarship.gender.toLowerCase() === studentProfile.gender?.toLowerCase()) {
            eligibilityScore += 20
            matchReasons.push(`Matches gender`)
          }

          if (scholarship.requirements.some((req) => req.includes("Income criteria varies"))) {
            eligibilityScore += 20
            matchReasons.push("Matches general income criteria")
          } else if (scholarship.requirements.some((req) => req.includes("Family income <"))) {
            const incomeRegex = /< ₹([\d,]+)/
            const match = scholarship.requirements.find((req) => req.includes("Family income <"))
            if (match) {
              const incomeLimit = parseInt(match.match(incomeRegex)[1].replace(/,/g, ""))
              if (studentProfile.family_income <= incomeLimit) {
                eligibilityScore += 20
                matchReasons.push(`Family income is below the limit (${incomeLimit})`)
              }
            }
          }

          if (scholarship.name === "AICTE Saksham Scholarship" && studentProfile.disabilities?.length > 0) {
            eligibilityScore += 20
            matchReasons.push("Matches disability criteria")
          }

          if (scholarship.category === "minority") {
            if (["Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi"].includes(studentProfile.category)) {
              eligibilityScore += 20
              matchReasons.push(`Matches minority category (${studentProfile.category})`)
            }
          }

          const courseLower = studentProfile.course?.toLowerCase() || ""
          if (scholarship.field === "general" || courseLower.includes(scholarship.field.toLowerCase()) || (scholarship.field === "engineering" && courseLower.includes("engineering"))) {
            eligibilityScore += 10
            matchReasons.push(scholarship.field === "general" ? "General scholarship, open to all fields" : `Matches field of study: ${scholarship.field}`)
          }

          return {
            ...scholarship,
            eligibility_score: Math.min(100, Math.round(eligibilityScore)),
            match_reasons: matchReasons,
            application_link: scholarship.link,
          }
        })
        .filter((scholarship) => scholarship.eligibility_score > 0)
        .sort((a, b) => b.eligibility_score - a.eligibility_score)

      setRecommendations(matchedScholarships)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    const element = componentRef.current
    if (!element) return

    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`Scholarship_Recommendations_${studentProfile.name?.replace(/\s/g, "_")}.pdf`)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  useEffect(() => {
    const checkAPIConnection = async () => {
      try {
        await apiService.healthCheck()
        setApiConnected(true)
      } catch {
        setApiConnected(false)
      }
    }
    checkAPIConnection()
    if (currentUser) getRecommendations() // Auto-fetch recommendations on load
  }, [currentUser])

  return (
    <div className="space-y-6">

      {loading && (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="space-y-4" ref={componentRef}>
          <h2 className="text-xl font-semibold text-gray-800">Found {recommendations.length} matching scholarships</h2>
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{rec.name}</h3>
                  <p className="text-gray-600">{rec.provider}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(rec.eligibility_score)}`}>
                    {t.eligibilityScore}: {rec.eligibility_score}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">{t.amount}</span>
                  <p className="font-semibold text-green-600">{rec.amount}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">{t.deadline}</span>
                  <p className="font-semibold">{rec.deadline}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">{t.category}</span>
                  <p className="font-semibold">{rec.category}</p>
                </div>
                <div>
                  <a
                    href={rec.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    {t.applyNow}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">{t.whyMatch}</h4>
                  <ul className="space-y-1">
                    {(rec.match_reasons || []).map((reason, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">{t.requirements}</h4>
                  <ul className="space-y-1">
                    {rec.requirements.map((req, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && recommendations.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <p className="text-gray-600">{t.noRecommendations}</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="text-right">
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {t.downloadPDF}
          </button>
        </div>
      )}
    </div>
  )
}

export default Recommendations
