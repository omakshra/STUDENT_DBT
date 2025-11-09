import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  DollarSign, 
  Save, 
  Edit3, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import apiService from '../services/apiservice';
import { useNavigate } from 'react-router-dom';

const StudentProfile = ({ currentUser, updateUserData, language }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    category: 'General',
    aadhaar: '',
    college_name: '',
    course: '',
    year_of_study: '1st Year',
    cgpa: '',
    dbt_status: 'Not Active',
    family_income: '',
    bank_account: '',
    ifsc_code: '',
    district: '',
    state: ''
  });

  const [initialProfileData, setInitialProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const navigate = useNavigate();

  const getTranslation = (key) => {
    const translations = {
      en: {
        title: "Student Profile",
        subtitle: "View and update your personal information",
        personalInfo: "Personal Information",
        academicInfo: "Academic Information",
        financialInfo: "Financial Information",
        saveProfile: "Save Profile",
        editProfile: "Edit Profile",
        cancel: "Cancel",
        saving: "Saving...",
        saved: "Profile saved successfully!",
        error: "Error saving profile. Please try again.",
        name: "Full Name",
        email: "Email",
        phone: "Phone",
        gender: "Gender",
        category: "Category",
        aadhaar: "Aadhaar Number",
        collegeName: "College Name",
        course: "Course",
        yearOfStudy: "Year of Study",
        cgpa: "CGPA",
        dbtStatus: "DBT Status",
        familyIncome: "Family Income (Annual)",
        bankAccount: "Bank Account",
        ifscCode: "IFSC Code",
        district: "District",
        state: "State",
        required: "This field is required",
        invalidEmail: "Please enter a valid email",
        invalidPhone: "Please enter a valid 10-digit phone number",
        invalidCGPA: "CGPA must be between 0 and 10",
        invalidIncome: "Please enter a valid income amount",
        aadhaarLength: "Aadhaar number must be 12 digits"
      }
      // Add other languages if needed
    };
    return translations[language]?.[key] || translations.en[key];
  };

  const validateField = (name, value) => {
  let error = '';
  switch (name) {
    case 'name':
    case 'college_name':
    case 'course':
    case 'bank_account':
    case 'ifsc_code':
      if (!value?.trim()) error = getTranslation('required');
      break;
    case 'email':
      if (!value?.trim()) error = getTranslation('required');
      else if (!/\S+@\S+\.\S+/.test(value)) error = getTranslation('invalidEmail');
      break;
    case 'phone':
      if (!value?.trim()) error = getTranslation('required');
      else if (!/^\d{10}$/.test(value)) error = getTranslation('invalidPhone');
      break;
    case 'cgpa':
      if (!value?.toString()?.trim()) error = getTranslation('required');
      else if (isNaN(value) || value < 0 || value > 10) error = getTranslation('invalidCGPA');
      break;
    case 'family_income':
      if (!value?.toString()?.trim()) error = getTranslation('required');
      else if (isNaN(value) || value < 0) error = getTranslation('invalidIncome');
      break;
    case 'aadhaar':
      if (value && value.length !== 12) error = getTranslation('aadhaarLength');
      break;
    default:
      break;
  }
  return error;
};

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setProfileData(prev => ({ ...prev, [name]: value }));

  const error = validateField(name, value);
  setErrors(prev => ({ ...prev, [name]: error }));
};

  useEffect(() => {
  const fetchProfile = async () => {
    if (!apiService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    try {
      const profile = await apiService.getStudentProfile();
      if (profile) {
        const defaultProfile = {
          name: '', email: '', phone: '', gender: 'Male', category: 'General', aadhaar: '',
          college_name: '', course: '', year_of_study: '1st Year', cgpa: '', dbt_status: 'Not Active',
          family_income: '', bank_account: '', ifsc_code: '', district: '', state: ''
        };
        const fullProfile = { ...defaultProfile, ...profile };
        setProfileData(fullProfile);
        setInitialProfileData(fullProfile);
        // remove updateUserData here; update only after save
        // updateUserData(fullProfile);
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      navigate("/login");
    }
  };
  fetchProfile();
}, [navigate]);

  const handleSave = async () => {
  setIsSaving(true);
  setSaveStatus(null);
  setSaveErrorMessage('');

  // Trim and sanitize
  const sanitizedProfile = {};
  Object.entries(profileData).forEach(([key, value]) => {
    if (typeof value === 'string') value = value.trim();

    // Convert empty numeric fields to null
    if ((key === 'cgpa' || key === 'family_income') && value === '') value = null;

    sanitizedProfile[key] = value;
  });

  // Validate all fields synchronously
  const newErrors = {};
  const fieldsToValidate = [
    'name', 'email', 'phone', 'college_name', 'course', 'year_of_study',
    'cgpa', 'family_income', 'bank_account', 'ifsc_code', 'district', 'state', 'aadhaar'
  ];

  fieldsToValidate.forEach(field => {
    newErrors[field] = validateField(field, sanitizedProfile[field]);
  });

  // If any errors exist, stop
  if (Object.values(newErrors).some(err => err)) {
    setErrors(newErrors);
    setIsSaving(false);
    return;
  }

  try {
    console.log("Submitting profile data:", sanitizedProfile);
    const updatedProfile = await apiService.updateStudentProfile(sanitizedProfile);
    
    if (updatedProfile) {
      setProfileData(updatedProfile);
      setInitialProfileData(updatedProfile);
      apiService.updateUserData(updatedProfile);
      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('error');
      setSaveErrorMessage('Unknown error occurred');
    }
  } catch (err) {
    console.error("Error saving profile:", err);
    setSaveStatus('error');
    setSaveErrorMessage(err?.message || 'Error saving profile');
  } finally {
    setIsSaving(false);
  }
};


  const handleCancel = () => {
    setProfileData(initialProfileData);
    setErrors({});
    setIsEditing(false);
  };

  const renderInputField = (label, name, type = "text", icon, props = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <div className="flex items-center">
            {icon}
            <span className="ml-2">{label}</span>
        </div>
      </label>
      <input
        type={type}
        name={name}
        value={profileData[name] || ''}
        onChange={handleInputChange}
        disabled={!isEditing}
        className={`w-full px-3 py-2 border rounded-md ${
          errors[name] ? 'border-red-300' : 'border-gray-300'
        } ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:ring-blue-500 focus:border-blue-500`}
        {...props}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  const renderSelectField = (label, name, options, icon) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <div className="flex items-center">
            {icon}
            <span className="ml-2">{label}</span>
        </div>
      </label>
      <select
        name={name}
        value={profileData[name] || ''}
        onChange={handleInputChange}
        disabled={!isEditing}
        className={`w-full px-3 py-2 border rounded-md ${
          errors[name] ? 'border-red-300' : 'border-gray-300'
        } ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:ring-blue-500 focus:border-blue-500`}
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{getTranslation('title')}</h1>
          <p className="text-blue-100">{getTranslation('subtitle')}</p>
        </div>
        {/* Header Buttons */}
<div className="flex space-x-2">
  {!isEditing ? (
    <Button 
      type="button" 
      onClick={() => {
        setIsEditing(true);
        // clear previous save status if any
        setSaveStatus(null);
      }} 
      className="bg-white text-blue-600 hover:bg-blue-50"
    >
      <Edit3 className="w-4 h-4 mr-2" />
      {getTranslation('editProfile')}
    </Button>
  ) : (
    <>
      <Button 
        type="button" 
        onClick={handleCancel} 
        variant="outline" 
        className="bg-white text-blue-600 border-white hover:bg-blue-50"
      >
        {getTranslation('cancel')}
      </Button>
      <Button 
        type="button"
        onClick={handleSave} 
        disabled={isSaving} 
        className="bg-green-600 hover:bg-green-700"
      >
        <Save className="w-4 h-4 mr-2" /> 
        {isSaving ? getTranslation('saving') : getTranslation('saveProfile')}
      </Button>
    </>
  )}
</div>

      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`p-4 rounded-lg flex items-center shadow-md transition-opacity duration-300 ${saveStatus === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {saveStatus === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
          {saveStatus === 'success' ? getTranslation('saved') : saveErrorMessage || getTranslation('error')}
        </div>
      )}

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
            <User className="w-5 h-5 mr-2" />
            {getTranslation('personalInfo')}
          </h3>
          <div className="space-y-4">
            {renderInputField(getTranslation('name'), 'name', 'text', <User className="w-4 h-4" />)}
            {renderInputField(getTranslation('email'), 'email', 'email', <Mail className="w-4 h-4" />)}
            {renderInputField(getTranslation('phone'), 'phone', 'tel', <Phone className="w-4 h-4" />, { maxLength: 10 })}
            {renderSelectField(getTranslation('gender'), 'gender', ['Male', 'Female', 'Other'], <User className="w-4 h-4" />)}
            {renderSelectField(getTranslation('category'), 'category', ['General', 'OBC', 'SC', 'ST'], <User className="w-4 h-4" />)}
            {renderInputField(getTranslation('aadhaar'), 'aadhaar', 'text', <User className="w-4 h-4" />, { maxLength: 12 })}
          </div>
        </Card>

        {/* Academic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-green-600">
            <GraduationCap className="w-5 h-5 mr-2" />
            {getTranslation('academicInfo')}
          </h3>
          <div className="space-y-4">
            {renderInputField(getTranslation('collegeName'), 'college_name', 'text', <GraduationCap className="w-4 h-4" />)}
            {renderInputField(getTranslation('course'), 'course', 'text', <GraduationCap className="w-4 h-4" />)}
            {renderSelectField(getTranslation('yearOfStudy'), 'year_of_study', ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'], <Calendar className="w-4 h-4" />)}
            {renderInputField(getTranslation('cgpa'), 'cgpa', 'number', <GraduationCap className="w-4 h-4" />, { min: 0, max: 10, step: 0.1 })}
            {renderSelectField(getTranslation('dbtStatus'), 'dbt_status', ['Active', 'Pending', 'Not Active'], <DollarSign className="w-4 h-4" />)}
          </div>
        </Card>

        {/* Financial Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-purple-600">
            <DollarSign className="w-5 h-5 mr-2" />
            {getTranslation('financialInfo')}
          </h3>
          <div className="space-y-4">
            {renderInputField(getTranslation('familyIncome'), 'family_income', 'number', <DollarSign className="w-4 h-4" />, { min: 0 })}
            {renderInputField(getTranslation('bankAccount'), 'bank_account', 'text', <DollarSign className="w-4 h-4" />)}
            {renderInputField(getTranslation('ifscCode'), 'ifsc_code', 'text', <DollarSign className="w-4 h-4" />)}
            {renderInputField(getTranslation('district'), 'district', 'text', <DollarSign className="w-4 h-4" />)}
            {renderInputField(getTranslation('state'), 'state', 'text', <DollarSign className="w-4 h-4" />)}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;