"use client"

import { useState } from "react"

const Chatbot = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text:
        language === "en"
          ? "Hello! I'm here to help you with DBT and scholarship questions. How can I assist you today?"
          : "नमस्ते! मैं डीबीटी और छात्रवृत्ति के प्रश्नों में आपकी मदद के लिए यहां हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
    },
  ])
  const [inputText, setInputText] = useState("")

  const quickQuestions = [
    {
      en: "How to enable DBT?",
      hi: "डीबीटी कैसे सक्षम करें?",
      answer: {
        en: "To enable DBT: 1) Visit your bank branch with Aadhaar and passbook, 2) Fill the DBT form, 3) Complete biometric verification. It takes 2-3 working days.",
        hi: "डीबीटी सक्षम करने के लिए: 1) आधार और पासबुक के साथ अपनी बैंक शाखा में जाएं, 2) डीबीटी फॉर्म भरें, 3) बायोमेट्रिक सत्यापन पूरा करें। इसमें 2-3 कार्य दिवस लगते हैं।",
      },
    },
    {
      en: "Check scholarship eligibility",
      hi: "छात्रवृत्ति योग्यता जांचें",
      answer: {
        en: "Your eligibility depends on: academic performance, family income, category, and DBT status. Visit the Scholarships page to see all available options.",
        hi: "आपकी योग्यता निर्भर करती है: शैक्षणिक प्रदर्शन, पारिवारिक आय, श्रेणी, और डीबीटी स्थिति पर। सभी उपलब्ध विकल्प देखने के लिए छात्रवृत्ति पृष्ठ पर जाएं।",
      },
    },
    {
      en: "Required documents",
      hi: "आवश्यक दस्तावेज",
      answer: {
        en: "For DBT: Aadhaar card, bank passbook, student ID. For scholarships: mark sheets, income certificate, caste certificate (if applicable).",
        hi: "डीबीटी के लिए: आधार कार्ड, बैंक पासबुक, छात्र आईडी। छात्रवृत्ति के लिए: मार्क शीट, आय प्रमाण पत्र, जाति प्रमाण पत्र (यदि लागू हो)।",
      },
    },
  ]

  const handleSendMessage = (text = inputText) => {
    if (!text.trim()) return

    // Add user message
    const newMessages = [...messages, { type: "user", text }]

    // Find matching answer
    const question = quickQuestions.find((q) => q.en.toLowerCase().includes(text.toLowerCase()) || q.hi.includes(text))

    let botResponse
    if (question) {
      botResponse = question.answer[language]
    } else {
      botResponse =
        language === "en"
          ? "I understand you're asking about DBT or scholarships. For specific help, please contact our support team or visit the FAQ section."
          : "मैं समझता हूं कि आप डीबीटी या छात्रवृत्ति के बारे में पूछ रहे हैं। विशिष्ट सहायता के लिए, कृपया हमारी सहायता टीम से संपर्क करें या FAQ अनुभाग देखें।"
    }

    setMessages([...newMessages, { type: "bot", text: botResponse }])
    setInputText("")
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl border z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold">{language === "en" ? "DBT Assistant" : "डीबीटी सहायक"}</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="p-4 border-t">
            <p className="text-xs text-gray-600 mb-2">{language === "en" ? "Quick questions:" : "त्वरित प्रश्न:"}</p>
            <div className="space-y-1">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(q[language])}
                  className="block w-full text-left text-xs text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                >
                  {q[language]}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={language === "en" ? "Type your question..." : "अपना प्रश्न टाइप करें..."}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
