import React, { useState } from 'react';
import {
  Download,
  MapPin,
  FileText,
  Clock,
  ChevronRight,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Info,
  CheckCircle,
  AlertCircle,
  User,
  Banknote,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import AnimatedDiagram from '../components/AnimatedDiagram';
import mockData from '../mockData.json';

// Simple info box for benefits and consequences
const InfoBox = ({ type, text }) => {
  const isBenefit = type === 'benefit';
  const Icon = isBenefit ? CheckCircle : AlertCircle;
  const colorClass = isBenefit ? 'text-green-500' : 'text-red-500';

  return (
    <div
      className={`p-4 rounded-lg border-2 ${isBenefit ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
    >
      <div className="flex items-center mb-2">
          <Icon className={`h-6 w-6 mr-2 ${colorClass}`} />
        <span className={`font-semibold text-lg ${isBenefit ? 'text-green-800' : 'text-red-800'}`}>
          {isBenefit ? 'Benefit' : 'Consequence'}
        </span>
      </div>
      <p className={`text-sm ${isBenefit ? 'text-green-700' : 'text-red-700'}`}>
        {text}
      </p>
    </div>
  );
};

// Remove SimpleDiagram since we're using AnimatedDiagram component

const Guidance = ({ language }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedStep, setExpandedStep] = useState(null);

  const { student } = mockData || { student: {} };

  // Debug logging
  console.log('Current Step:', currentStep);

  const steps = [
    {
      id: 1,
      title: "Visit Your Bank Branch",
      description: "Go to your bank with Aadhaar card and passbook",
      duration: "30 minutes",
      icon: MapPin,
      benefit: "Direct access to bank officials for immediate assistance",
      consequence: "Delayed scholarship payments if not completed",
      documents: ["Aadhaar Card", "Bank Passbook", "Student ID"],
      tips: [
        "Visit during non-peak hours (10 AM - 2 PM)",
        "Carry original documents, not photocopies",
        "Dress appropriately for bank visit"
      ]
    },
    {
      id: 2,
      title: "Fill DBT Seeding Form",
      description: "Complete the Direct Benefit Transfer application form",
      duration: "15 minutes",
      icon: FileText,
      benefit: "Enables automatic scholarship transfers to your account",
      consequence: "Manual payment processing with delays",
      documents: ["DBT Seeding Form", "Aadhaar Details", "Bank Account Details"],
      tips: [
        "Fill all fields accurately",
        "Double-check account number",
        "Keep a copy of the form"
      ]
    },
    {
      id: 3,
      title: "Complete Biometric Verification",
      description: "Verify your identity using fingerprint or iris scan",
      duration: "10 minutes",
      icon: User,
      benefit: "Secure and instant identity verification",
      consequence: "Form rejection and re-application required",
      documents: ["Biometric Data", "Aadhaar Card"],
      tips: [
        "Clean your fingers before scanning",
        "Remove contact lenses for iris scan",
        "Stay calm during the process"
      ]
    }
  ];

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">
          {language === "en" ? "DBT Seeding Guidance" : "डीबीटी सीडिंग मार्गदर्शन"}
          </h1>
        <p className="text-blue-100">
          {language === "en" 
            ? "Complete step-by-step guide to enable Direct Benefit Transfer for your scholarships"
            : "अपनी छात्रवृत्ति के लिए प्रत्यक्ष लाभ हस्तांतरण सक्षम करने के लिए चरणबद्ध मार्गदर्शन"}
        </p>
      </div>

      {/* Visual Guidance Section */}
      <Card>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-purple-600" />
            {language === "en" ? "Visual Guidance" : "दृश्य मार्गदर्शन"}
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            {language === "en" 
              ? "Watch these helpful videos to better understand the DBT seeding process"
              : "डीबीटी सीडिंग प्रक्रिया को बेहतर समझने के लिए इन सहायक वीडियो को देखें"}
          </p>
          
          {/* Video Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="p-4">
                <video 
                  className="w-full rounded-lg shadow-sm" 
                  controls 
                  preload="metadata"
                  poster="https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=DBT+Awareness+Intro"
                >
                  <source src="/assets/1.mp4" type="video/mp4" />
                  <source src="/videos/dbt-awareness-intro.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
                <div className="mt-4 text-center">
                  <h4 className="font-semibold text-gray-800 text-lg mb-2">
                    {language === "en" ? "DBT Awareness Intro" : "डीबीटी जागरूकता परिचय"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === "en" 
                      ? "Learn about Direct Benefit Transfer and its importance for students"
                      : "प्रत्यक्ष लाभ हस्तांतरण और छात्रों के लिए इसके महत्व के बारे में जानें"}
                  </p>
                </div>
              </div>
            </div>

            {/* Video 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="p-4">
                <video 
                  className="w-full rounded-lg shadow-sm" 
                  controls 
                  preload="metadata"
                  poster="https://via.placeholder.com/400x225/7C3AED/FFFFFF?text=Step-by-Step+DBT+Process"
                >
                  <source src="/assets/2.mp4" type="video/mp4" />
                  <source src="/videos/dbt-step-by-step.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
                <div className="mt-4 text-center">
                  <h4 className="font-semibold text-gray-800 text-lg mb-2">
                    {language === "en" ? "Step-by-Step DBT Process" : "चरणबद्ध डीबीटी प्रक्रिया"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === "en" 
                      ? "Follow along with detailed instructions for completing DBT seeding"
                      : "डीबीटी सीडिंग पूरा करने के लिए विस्तृत निर्देशों के साथ आगे बढ़ें"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Access Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-blue-800 mb-1">
                  {language === "en" ? "Video Access" : "वीडियो पहुंच"}
                </h5>
                <p className="text-sm text-blue-700">
                  {language === "en" 
                    ? "Videos are optimized for both desktop and mobile viewing. Ensure you have a stable internet connection for the best experience."
                    : "वीडियो डेस्कटॉप और मोबाइल दोनों के लिए अनुकूलित हैं। सबसे अच्छे अनुभव के लिए सुनिश्चित करें कि आपके पास स्थिर इंटरनेट कनेक्शन है।"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Bar */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {language === "en" ? "Progress" : "प्रगति"}
            </h2>
            <span className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
                </div>
          <Progress value={progressPercentage} className="mb-4" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{Math.round(progressPercentage)}% Complete (Step {currentStep}/{steps.length})</span>
            <span>
              {language === "en" ? "Estimated time remaining:" : "अनुमानित शेष समय:"} 45 minutes
            </span>
                </div>
              </div>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card 
            key={step.id} 
            className={`transition-all duration-300 cursor-pointer hover:shadow-md ${
              currentStep === step.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
            onClick={() => {
              console.log('Step clicked:', step.id);
              setCurrentStep(step.id);
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep > step.id ? 'bg-green-600' : 
                    currentStep === step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-bold">{step.id}</span>
                    )}
              </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
            </div>
            </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {step.duration}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent step navigation when clicking the button
                      setExpandedStep(expandedStep === step.id ? null : step.id);
                    }}
                  >
                    {expandedStep === step.id ? 'Hide Details' : 'Show Details'}
                  </Button>
                            </div>
                          </div>

              {expandedStep === step.id && (
                <div className="mt-6 border-t pt-6">
                  <AnimatedDiagram stepId={step.id} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <InfoBox type="benefit" text={step.benefit} />
                    <InfoBox type="consequence" text={step.consequence} />
                          </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Required Documents
                      </h4>
                      <ul className="space-y-2">
                        {step.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                                </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-600" />
                        Pro Tips
                      </h4>
                      <ul className="space-y-2">
                        {step.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                        </div>
                      </div>
              )}
            </div>
          </Card>
                  ))}
                </div>


      {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newStep = Math.max(1, currentStep - 1);
                      console.log('Previous clicked, setting step to:', newStep);
                      setCurrentStep(newStep);
                    }}
                    disabled={currentStep === 1}
                  >
                    Previous Step
                  </Button>
                  <Button
                    onClick={() => {
                      const newStep = Math.min(steps.length, currentStep + 1);
                      console.log('Next clicked, setting step to:', newStep);
                      setCurrentStep(newStep);
                    }}
                    disabled={currentStep === steps.length}
                  >
                    Next Step
                  </Button>
                </div>

      {/* Help Section */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Contact Support</h4>
              <p className="text-sm text-blue-700 mb-3">
                Get personalized assistance with your DBT seeding process
              </p>
              <Button size="sm" variant="outline">
                Contact Support
              </Button>
                  </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Download Guide</h4>
              <p className="text-sm text-green-700 mb-3">
                Get a printable PDF guide for offline reference
              </p>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
                  </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Guidance;