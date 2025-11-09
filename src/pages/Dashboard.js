import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, TrendingUp, DollarSign,
  Calendar, MapPin, Volume2, Award, Play, Info, BookOpen,
  ArrowRight, Users, Target, CheckSquare
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import mockData from '../mockData.json';
import HeroCarousel from '../components/HeroCarousel';
import InteractiveMap from '../components/InteractiveMap';

const Dashboard = ({ onPageChange }) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(null);

  const { student, scholarships } = mockData || { student: {}, scholarships: [] };

  const eligibleScholarships = scholarships?.filter(s => s.status === 'eligible') || [];
  const potentialAmount = eligibleScholarships.reduce((sum, s) => sum + (s.amount || 0), 0);
  const missedAmount = student?.dbtSeeded ? 0 : potentialAmount;

const educationalVideos = [
  {
    id: 1,
    title: "What is Aadhaar Linking vs DBT Seeding?",
    duration: "3:45",
    thumbnail: "https://img.youtube.com/vi/L90y6OYhVTc/hqdefault.jpg",
    description: "Learn the crucial difference between having your Aadhaar linked and DBT-enabled accounts",
    youtubeUrl: "https://www.youtube.com/watch?v=L90y6OYhVTc"
  },
  {
    id: 2,
    title: "Step-by-Step DBT Seeding Process",
    duration: "5:20",
    thumbnail: "https://img.youtube.com/vi/DkNf_21pgRM/hqdefault.jpg",
    description: "Complete guide to enable DBT on your bank account for scholarship disbursements",
    youtubeUrl: "https://www.youtube.com/watch?v=DkNf_21pgRM"
  },
  {
    id: 3,
    title: "Common Mistakes Students Make",
    duration: "4:15",
    thumbnail: "https://img.youtube.com/vi/nH3CJ0rQ5NI/hqdefault.jpg",
    description: "Avoid these pitfalls that delay your scholarship payments",
    youtubeUrl: "https://www.youtube.com/watch?v=nH3CJ0rQ5NI"
  }
];

  const keyDifferences = [
    {
      aspect: "Aadhaar Linking",
      description: "Your Aadhaar number is connected to your bank account",
      status: "basic",
      icon: CheckCircle,
      color: "blue"
    },
    {
      aspect: "DBT Seeding", 
      description: "Your account is enabled to receive government benefits directly",
      status: "advanced",
      icon: Target,
      color: "green"
    }
  ];

  const dbtBenefits = [
    "Faster scholarship disbursement",
    "Direct transfer without intermediaries",
    "Reduced processing delays",
    "Transparent transaction tracking",
    "Automatic eligibility verification"
  ];

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(
      `Welcome ${student.name}. Your Aadhaar is linked but DBT is not seeded. You may miss scholarships worth ₹${potentialAmount}.`
    );
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Interactive Map */}
      <InteractiveMap />
      

      {/* Critical Alert Banner */}
      {!student?.dbtSeeded && (
        <Card className="p-6 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-xl font-bold">Action Required: Enable DBT Seeding</h3>
                <p className="text-red-100 mt-1">
                  Your Aadhaar is linked, but DBT is not enabled. This could delay ₹
                  {missedAmount?.toLocaleString() || 0} in scholarships!
                </p>
              </div>
            </div>
            <Button
              className="bg-white text-red-600 hover:bg-red-50"
              onClick={() => onPageChange?.('guidance')}
            >
              Learn How
            </Button>
          </div>
        </Card>
      )}

      {/* Educational Video Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-blue-500" />
            Understanding DBT: Watch & Learn
          </h2>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            Essential Knowledge
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {educationalVideos.map((video) => (
            <div key={video.id} className="group cursor-pointer">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-all">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
  <Button 
  size="sm" 
  className="bg-white text-black hover:bg-gray-100"
  onClick={() => setCurrentVideo(video.youtubeUrl)}
>
  <Play className="h-4 w-4 mr-1" />
  Watch
</Button>

</div>

                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="mt-2">
                <h4 className="font-medium text-gray-900 text-sm">{video.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Differences Infographic */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Info className="h-6 w-6 mr-2 text-yellow-500" />
          Aadhaar Linked ≠ DBT Enabled
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="font-semibold text-blue-900">Aadhaar Linked Account</h3>
            </div>
            <p className="text-blue-800 text-sm mb-3">Your Aadhaar number is connected to your bank account for identification.</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-blue-700">
                <CheckSquare className="h-4 w-4 mr-2" />
                KYC verification completed
              </div>
              <div className="flex items-center text-sm text-blue-700">
                <CheckSquare className="h-4 w-4 mr-2" />
                Account holder verified
              </div>
              <div className="flex items-center text-sm text-red-600">
                <XCircle className="h-4 w-4 mr-2" />
                NOT ready for direct benefits
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center mb-3">
              <Target className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="font-semibold text-green-900">DBT Enabled Account</h3>
            </div>
            <p className="text-green-800 text-sm mb-3">Your account can receive government scholarships and benefits directly.</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-green-700">
                <CheckSquare className="h-4 w-4 mr-2" />
                Aadhaar linking completed
              </div>
              <div className="flex items-center text-sm text-green-700">
                <CheckSquare className="h-4 w-4 mr-2" />
                DBT seeding activated
              </div>
              <div className="flex items-center text-sm text-green-700">
                <CheckSquare className="h-4 w-4 mr-2" />
                Ready for scholarship disbursement
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Aadhaar Status */}
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aadhaar Status</p>
              <div className="flex items-center mt-2">
                {student.aadhaarLinked ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      Linked
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    <Badge variant="destructive">Not Linked</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* DBT Status */}
        <Card className="p-6 hover:shadow-md transition-shadow border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">DBT Status</p>
              <div className="flex items-center mt-2">
                {student.dbtSeeded ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      Seeded
                    </Badge>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                      Not Seeded
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {student.bankName} •••• {student.accountLast4}
              </p>
              {!student.dbtSeeded && (
                <Button size="sm" className="mt-2 bg-orange-500 hover:bg-orange-600">
                  Enable Now
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Scholarship Alert */}
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scholarship Alert</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-lg font-semibold text-gray-900">
                  {eligibleScholarships.length} Eligible
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total Value: ₹{potentialAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* DBT Benefits Showcase */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Award className="h-6 w-6 mr-2 text-green-500" />
          Why DBT Seeding Matters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-900 mb-3">Benefits of DBT-Enabled Account:</h3>
            <div className="space-y-2">
              {dbtBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-green-800">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <p className="text-sm text-gray-600 mb-4">Faster disbursement with DBT-enabled accounts</p>
              
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Without DBT</span>
                <span>With DBT</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-red-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full w-4/5"></div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <div className="flex-1 bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-1/5"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>45-60 days</span>
                <span>7-15 days</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Scholarships */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-500" />
            Eligible Scholarships
          </h3>
          <div className="space-y-3">
            {eligibleScholarships.slice(0, 3).map((scholarship) => (
              <div key={scholarship.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{scholarship.title}</p>
                  <p className="text-sm text-gray-600">₹{scholarship.amount.toLocaleString()}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Student Profile */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Profile Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Class Year</span>
              <span className="font-medium">{student.scholarshipProfile.classYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category</span>
              <span className="font-medium">{student.scholarshipProfile.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Family Income</span>
              <span className="font-medium">₹{student.scholarshipProfile.annualFamilyIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">District</span>
              <span className="font-medium">{student.district}</span>
            </div>
          </div>
        </Card>
      </div>
      {currentVideo && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg overflow-hidden w-11/12 md:w-3/4 lg:w-1/2">
      <div className="flex justify-end p-2">
        <Button onClick={() => setCurrentVideo(null)}>Close</Button>
      </div>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          width="100%"
          height="100%"
          src={currentVideo.replace("watch?v=", "embed/")}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </div>
)}

      
      {/* District Statistics */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Users className="h-6 w-6 mr-2 text-purple-500" />
          {student.district} District Overview
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {mockData.districtStats.dbtEnabled}%
            </div>
            <p className="text-sm text-gray-600">DBT Enabled</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {mockData.districtStats.withoutDBT}%
            </div>
            <p className="text-sm text-gray-600">Without DBT</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {mockData.districtStats.collegeEnabled}%
            </div>
            <p className="text-sm text-gray-600">College Enabled</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {mockData.districtStats.totalStudents.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
        </div>
        
        <div className="mt-4 bg-white rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Good news!</strong> {mockData.districtStats.collegeEnabled}% of students in {student.college} have DBT enabled. 
            Join them to ensure faster scholarship disbursement!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;