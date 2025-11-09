"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"

// Vague responses in English, Hindi, Tamil
const vagueResponses = new Set([
  // English
  "ok", "okay", "sure", "done", "fine", "cool", "alright", "k", "yep", "yeah", "yup",
  // Hindi
  "ठीक है", "ठीक", "अच्छा", "ठीक है जी", "ठीक हैं",
  // Tamil
  "சரி", "சரி தான்", "சரி ஜி", "சரி ஆ", "சரி அது"
]);

const isVagueResponse = (msg) => {
  if (!msg) return false;
  const cleaned = msg.trim().toLowerCase();
  return vagueResponses.has(cleaned);
};

const FAQ = ({ language }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const [lastTopic, setLastTopic] = useState(null)

  // Translation map
  const getTranslation = () => {
    const translations = {
      en: {
        title: "DBT Support Assistant",
        subtitle: "Get instant answers about DBT, Aadhaar, and bank details",
        popularQuestions: "Popular Questions",
        chatAssistant: "Chat Assistant",
        clearChat: "Clear Chat",
        placeholder: "Type your question here...",
        send: "Send",
        listening: "Listening...",
        speaking: "Speaking...",
        botWelcome:
          "Hello! I'm here to help you with DBT, Aadhaar, and bank-related questions. You can ask me anything or choose from the popular questions below.",
        questions: {
          whatIsDbt: "What is DBT?",
          howToLink: "How do I link DBT?",
          notEnabled: "What if DBT is not enabled?",
          seedingTime: "How long does DBT seeding take?",
        },
        answers: {
          whatIsDbt:
            "DBT (Direct Benefit Transfer) is a government initiative that enables direct transfer of subsidies and benefits to beneficiaries' bank accounts. It ensures transparency and reduces delays in receiving government benefits like scholarships.",
          howToLink:
            "To link DBT: 1) Visit your bank with Aadhaar card and bank passbook, 2) Fill the DBT consent form, 3) Submit required documents, 4) Wait 2-3 working days for activation, 5) Check status on this portal.",
          notEnabled:
            "If DBT is not enabled, you won't receive government scholarships and benefits. Visit your bank immediately with Aadhaar card to complete the DBT seeding process. It's mandatory for all government schemes.",
          seedingTime:
            "DBT seeding typically takes 2-3 working days after submitting documents at the bank. You'll receive SMS confirmation once completed. You can check status on this portal or your bank's mobile app.",
        },
      },
      hi: {
        title: "DBT सहायता सहायक",
        subtitle: "DBT, आधार और बैंक विवरण के बारे में तुरंत उत्तर प्राप्त करें",
        popularQuestions: "लोकप्रिय प्रश्न",
        chatAssistant: "चैट सहायक",
        clearChat: "चैट साफ़ करें",
        placeholder: "अपना प्रश्न यहाँ टाइप करें...",
        send: "भेजें",
        listening: "सुन रहा हूँ...",
        speaking: "बोल रहा हूँ...",
        botWelcome:
          "नमस्ते! मैं DBT, आधार और बैंक से संबंधित प्रश्नों में आपकी मदद के लिए यहाँ हूँ। आप मुझसे कुछ भी पूछ सकते हैं या नीचे दिए गए लोकप्रिय प्रश्नों में से चुन सकते हैं।",
        questions: {
          whatIsDbt: "DBT क्या है?",
          howToLink: "मैं DBT कैसे लिंक करूँ?",
          notEnabled: "अगर DBT सक्षम नहीं है तो क्या करें?",
          seedingTime: "DBT सीडिंग में कितना समय लगता है?",
        },
        answers: {
          whatIsDbt:
            "DBT (Direct Benefit Transfer) एक सरकारी पहल है जो लाभार्थियों के बैंक खातों में सीधे सब्सिडी और लाभ ट्रांसफर करती है। यह पारदर्शिता सुनिश्चित करती है और सरकारी लाभों जैसे छात्रवृत्ति प्राप्त करने में देरी को कम करती है।",
          howToLink:
            "DBT लिंक करने के लिए: 1) अपने बैंक में आधार कार्ड और बैंक पासबुक के साथ जाएँ, 2) DBT सहमति फॉर्म भरें, 3) आवश्यक दस्तावेज़ जमा करें, 4) सक्रियण के लिए 2-3 कार्य दिवस प्रतीक्षा करें, 5) इस पोर्टल पर स्थिति जांचें।",
          notEnabled:
            "यदि DBT सक्षम नहीं है, तो आप सरकारी छात्रवृत्तियों और लाभों को प्राप्त नहीं करेंगे। DBT सीडिंग प्रक्रिया पूरी करने के लिए तुरंत अपने बैंक में आधार कार्ड के साथ जाएँ। यह सभी सरकारी योजनाओं के लिए अनिवार्य है।",
          seedingTime:
            "DBT सीडिंग आमतौर पर बैंक में दस्तावेज़ जमा करने के 2-3 कार्य दिवसों के बाद होती है। पूरी होने पर आपको SMS के माध्यम से पुष्टि मिलेगी। आप स्थिति इस पोर्टल या अपने बैंक के मोबाइल ऐप पर जांच सकते हैं।",
        },
      },
      ta: {
        title: "DBT ஆதரவு உதவியாளர்",
        subtitle: "DBT, ஆதார் மற்றும் வங்கி விவரங்கள் குறித்து உடனடி பதில்களை பெறுங்கள்",
        popularQuestions: "பிரபலமான கேள்விகள்",
        chatAssistant: "சாட் உதவியாளர்",
        clearChat: "சாட் அழிக்கவும்",
        placeholder: "உங்கள் கேள்வியை இங்கே تایப் செய்யவும்...",
        send: "அனுப்பு",
        listening: "கேட்கிறேன்...",
        speaking: "பேசுகிறேன்...",
        botWelcome:
          "வணக்கம்! நான் DBT, ஆதார் மற்றும் வங்கி தொடர்பான கேள்விகளில் உங்களுக்கு உதவ здесь இருக்கிறேன். நீங்கள் என்னிடம் ஏதேனும் கேட்கலாம் அல்லது கீழே உள்ள பிரபலமான கேள்விகளில் ஒன்றை தேர்ந்தெடுக்கலாம்.",
        questions: {
          whatIsDbt: "DBT என்ன?",
          howToLink: "நான் DBT ஐ எப்படி இணைக்க வேண்டும்?",
          notEnabled: "DBT இயங்காதால் என்ன செய்ய வேண்டும்?",
          seedingTime: "DBT சீடிங் எவ்வளவு நேரம் எடுக்கிறது?",
        },
        answers: {
          whatIsDbt:
            "DBT (Direct Benefit Transfer) என்பது பயனாளிகளின் வங்கி கணக்குகளுக்கு நேரடியாக நிதியுதவி மற்றும் நன்மைகளை வழங்கும் அரசு முயற்சி ஆகும். இது வெளிப்படைத்தன்மையை உறுதி செய்கிறது மற்றும் அரசு நன்மைகளைப் பெறுவதில் தாமதத்தை குறைக்கிறது.",
          howToLink:
            "DBT இணைக்க: 1) ஆதார் அட்டை மற்றும் வங்கி பாஸ்புக் கொண்டு உங்கள் வங்கிக்கு செல்லவும், 2) DBT ஒப்புதல் படிவத்தை பூர்த்தி செய்யவும், 3) தேவையான ஆவணங்களை சமர்ப்பிக்கவும், 4) செயல்படுத்த 2-3 வேலை நாட்கள் காத்திருங்கள், 5) நிலையை இந்த போர்டலில் சரிபார்க்கவும்.",
          notEnabled:
            "DBT இயங்காதிருந்தால், நீங்கள் அரசு கல்வி உதவித் தொகைகள் மற்றும் நன்மைகளை பெற மாட்டீர்கள். DBT சீடிங் செயல்முறையை நிறைவேற்ற உடனடியாக உங்கள் வங்கிக்கு ஆதார் அட்டை கொண்டு செல்லவும். இது அனைத்து அரசு திட்டங்களுக்கும் கட்டாயம்.",
          seedingTime:
            "DBT சீடிங் பொதுவாக வங்கியில் ஆவணங்களை சமர்ப்பித்த 2-3 வேலை நாட்களுக்குள் நிறைவடைகிறது. முடிந்ததும் SMS மூலம் உறுதி பெறுவீர்கள். நிலையை இந்த போர்டல் அல்லது உங்கள் வங்கியின் மொபைல் செயலியில் சரிபார்க்கலாம்.",
        },
      },
    }
    return translations[language] || translations.en;
  }

  const t = getTranslation();

  // Speech synthesis
  const speakText = (text, lang = language) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "hi" ? "hi-IN" : lang === "ta" ? "ta-IN" : "en-US";
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  // Speech recognition
  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === "hi" ? "hi-IN" : language === "ta" ? "ta-IN" : "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        stopSpeaking();
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setTimeout(() => sendMessage(transcript), 0);
      };

      recognitionRef.current.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  }

  // Multi-language DBT bot response
  const getBotResponse = async (message) => {
    const lowerMessage = message.trim().toLowerCase();
    let response = "";
    let handledInternally = false;

    // Greetings & thanks
    const greetings = ["hello", "hi", "hey", "नमस्ते", "ஹலோ", "வணக்கம்"];
    const thanks = ["thank you", "thanks", "धन्यवाद", "நன்றி"];
    if (greetings.some(g => lowerMessage.includes(g))) {
      response = {
        en: "Hello! How can I assist you with DBT, Aadhaar, or your linked bank account?",
        hi: "नमस्ते! मैं DBT, आधार या बैंक खाता लिंकिंग में आपकी मदद कैसे कर सकता हूँ?",
        ta: "வணக்கம்! நான் DBT, ஆதார் அல்லது உங்கள் வங்கி கணக்கு இணைப்பில் எவ்வாறு உதவ முடியும்?",
      }[language];
      handledInternally = true;
      setLastTopic(null);
    } else if (thanks.some(g => lowerMessage.includes(g))) {
      response = {
        en: "You're welcome! Let me know if you need help with DBT or Aadhaar-linked bank accounts.",
        hi: "आपका स्वागत है! यदि आपको DBT या आधार लिंक्ड बैंक खातों में मदद चाहिए तो बताएं।",
        ta: "சார்ந்து கொள்ளவும்! DBT அல்லது ஆதார் இணைக்கப்பட்ட வங்கி கணக்குகளில் உதவி தேவைப்பட்டால் எனக்கு சொல்லவும்.",
      }[language];
      handledInternally = true;
      setLastTopic(null);
    }

    // Direct DBT answers with multi-language keywords
    if (!handledInternally) {
      const keywordsMap = [
        { keywords: ["what is dbt", "dbt क्या है", "dbt என்ன"], answerKey: "whatIsDbt" },
        { keywords: ["how do i link dbt", "link dbt", "dbt लिंक कैसे करें", "dbt ஐ எப்படி இணைக்க வேண்டும்"], answerKey: "howToLink" },
        { keywords: ["dbt is not enabled", "not enabled", "dbt सक्षम नहीं है", "dbt இயங்கவில்லை"], answerKey: "notEnabled" },
        { keywords: ["how long does dbt seeding take", "seeding time", "dbt सीडिंग में कितना समय लगता है", "dbt சீடிங் எவ்வளவு நேரம் எடுக்கிறது"], answerKey: "seedingTime" },
      ];

      for (const item of keywordsMap) {
        if (item.keywords.some(k => lowerMessage.includes(k))) {
          response = t.answers[item.answerKey];
          handledInternally = true;
          break;
        }
      }
    }

    // Fallback to Gemini for DBT/Aadhaar/Bank queries
    if (!handledInternally) {
      const dbtKeywords = ["dbt", "aadhaar", "bank", "account", "beneficiary", "आधार", "बैंक", "खाता", "பைனான்ஸ்", "வங்கி"];
      if (dbtKeywords.some(k => lowerMessage.includes(k))) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/gemini", { prompt: message });
          response = res.data.response?.trim();

          if (!response) {
            response = {
              en: "I'm sorry, I couldn't find a clear answer. Please try rephrasing your DBT-related question.",
              hi: "माफ़ कीजिए, मुझे स्पष्ट उत्तर नहीं मिला। कृपया अपने DBT से संबंधित प्रश्न को पुनः लिखें।",
              ta: "மன்னிக்கவும், தெளிவான பதிலை நான் கண்டுபிடிக்கவில்லை. உங்கள் DBT தொடர்பான கேள்வியை மறுபடியும் கேட்கவும்.",
            }[language];
          }
        } catch (err) {
          console.error("Gemini API error:", err);
          response = {
            en: "Sorry, I couldn't get the information right now. Please try again later.",
            hi: "क्षमा करें, मैं अभी जानकारी प्राप्त नहीं कर सका। कृपया बाद में प्रयास करें।",
            ta: "மன்னிக்கவும், தற்போது தகவலை பெற முடியவில்லை. தயவுசெய்து பின்னர் முயற்சிக்கவும்.",
          }[language];
        }
      } else {
        // Reject non-DBT/Aadhaar/bank queries politely
        response = {
          en: "I'm here to help only with DBT, Aadhaar, and bank account linking questions. Please ask something related.",
          hi: "मैं केवल DBT, आधार और बैंक खाता लिंकिंग प्रश्नों में मदद करने के लिए यहाँ हूँ। कृपया संबंधित प्रश्न पूछें।",
          ta: "நான் DBT, ஆதார் மற்றும் வங்கி கணக்கு இணைப்பு கேள்விகளில் மட்டும் உதவக்கூடியவன். தயவுசெய்து தொடர்புடைய கேள்வியை கேட்கவும்.",
        }[language];
      }
    }

    return response;
  };

  // Send message handler
  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    stopSpeaking();

    const userMessage = { type: "user", text: messageText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    if (isVagueResponse(messageText)) {
      const politeReply = {
        type: "bot",
        text: {
          en: "Noted! Let me know if you need help with DBT, Aadhaar, or linking your bank account.",
          hi: "समझ गया! यदि आपको DBT, आधार या बैंक खाता लिंकिंग में मदद चाहिए तो बताएं।",
          ta: "கேள்வி பதிவு செய்யப்பட்டது! DBT, ஆதார் அல்லது வங்கி இணைப்பில் உதவி தேவைப்பட்டால் எனக்கு சொல்லவும்.",
        }[language],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, politeReply]);
      return;
    }

    const botResponseText = await getBotResponse(messageText);
    const botMessage = { type: "bot", text: botResponseText, timestamp: new Date() };
    setMessages((prev) => [...prev, botMessage]);
  }

  const handlePopularQuestion = (questionKey) => {
    const questionText = t.questions[questionKey];
    sendMessage(questionText);
  }

  const clearChat = () => {
    setMessages([]);
    setLastTopic(null);
    stopSpeaking();
    const welcomeMessage = { type: "bot", text: t.botWelcome, timestamp: new Date() };
    setMessages([welcomeMessage]);
  }

  useEffect(() => {
    if (messages.length === 0 || messages[0].text !== t.botWelcome) {
      const welcomeMessage = { type: "bot", text: t.botWelcome, timestamp: new Date() };
      setMessages([welcomeMessage]);
      setLastTopic(null);
    }
  }, [language, t.botWelcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
      </div>

      {/* Popular Questions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.popularQuestions}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(t.questions).map(([key, question]) => (
            <button
              key={key}
              onClick={() => handlePopularQuestion(key)}
              className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{t.chatAssistant}</h3>
          <button onClick={clearChat} className="text-sm text-blue-600 hover:underline">
            {t.clearChat}
          </button>
        </div>

        <div
          className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50"
          aria-live="polite"
          aria-atomic="true"
          role="log"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg break-words whitespace-pre-wrap text-sm
                  ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-900 border border-gray-200"}`}
              >
                {msg.text}
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex items-center p-4 border-t border-gray-200 space-x-3">
          <textarea
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.placeholder}
            className="flex-grow resize-none rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={isSpeaking}
          />
          <button
            onClick={sendMessage}
            disabled={isSpeaking || !inputMessage.trim()}
            className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm`}
            aria-label={t.send}
          >
            {t.send}
          </button>
{/* Speech recognition (mic) */}
<button
  onClick={isListening ? () => recognitionRef.current?.stop() : startListening}
  className={`p-2 rounded-full border border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors`}
  aria-label={isListening ? t.listening : "Start voice input"}
  title={isListening ? t.listening : "Start voice input"}
  type="button"
>
  {isListening ? (
    // 🔴 Mic ON (listening) – solid with red color
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-red-600 animate-pulse"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 14a3 3 0 003-3V7a3 3 0 00-6 0v4a3 3 0 003 3z" />
      <path d="M19 11a7 7 0 01-14 0m7 8v3m-4-3h8" />
    </svg>
  ) : (
    // ⚪ Mic OFF (idle) – clean outline
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M12 14a3 3 0 003-3V7a3 3 0 00-6 0v4a3 3 0 003 3z" />
      <path d="M19 11a7 7 0 01-14 0m7 8v3m-4-3h8" />
    </svg>
  )}
</button>


         {/* Text to Speech button */}
<button
  onClick={() => {
    if (isSpeaking) {
      stopSpeaking(); // 🔴 Stop speech if already speaking
    } else {
      if (messages.length > 0) {
        const lastBotMsg = [...messages].reverse().find((m) => m.type === "bot");
        if (lastBotMsg) speakText(lastBotMsg.text, language);
      }
    }
  }}
  className="p-2 rounded-full border border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
  aria-label={isSpeaking ? "Stop speaking" : t.speaking}
  title={isSpeaking ? "Stop speaking" : t.speaking}
  type="button"
>
  {isSpeaking ? (
    // 🔴 Show stop icon while speaking
    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
      <rect x="6" y="6" width="8" height="8" rx="1" />
    </svg>
  ) : (
    // 🟢 Show play/speaker icon when idle
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 5a3 3 0 00-3 3v4a3 3 0 006 0V8a3 3 0 00-3-3z" />
      <path d="M5 8v4a5 5 0 0010 0V8a5 5 0 00-10 0z" />
    </svg>
  )}
</button>

        </div>
      </div>
    </div>
  )
}

export default FAQ
