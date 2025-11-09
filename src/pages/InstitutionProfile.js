import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import apiService from '../services/api';

const InstitutionProfile = ({ language, currentUser, updateUserData }) => {
  const [institutionData, setInstitutionData] = useState({
    name: '',
    code: '',
    district: '',
    panchayat: '',
    contact_person_name: '',
    contact_person_mobile: '',
    contact_person_email: '',
    total_students: 0
  });
  const [students, setStudents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing institution and mock student/ticket data
  useEffect(() => {
    const loadInstitutionData = async () => {
      if (currentUser && currentUser.institution_data) {
        setInstitutionData(currentUser.institution_data);
      } else if (currentUser && currentUser.role === 'institution') {
        // Try to load institution data from database if not in user data
        try {
          const institutions = await apiService.getAllInstitutions();
          // Find institution by email or name if available
          const userInstitution = institutions.find(inst => 
            inst.contact_person_email === currentUser.email || 
            inst.name === currentUser.name
          );
          if (userInstitution) {
            setInstitutionData(userInstitution);
          }
        } catch (error) {
          console.log('No existing institution data found');
        }
      }
    };
    
    loadInstitutionData();

    // Mock student and ticket data (replace with API calls later)
    setStudents([
      {
        id: 1,
        name: "Student 1",
        student_id: "ST001",
        dbt_status: "Enabled",
        aadhaar_linked: true,
        bank_account_seeded: true,
        ticket_status: "None"
      },
      {
        id: 2,
        name: "Student 2", 
        student_id: "ST002",
        dbt_status: "Not Enabled",
        aadhaar_linked: false,
        bank_account_seeded: false,
        ticket_status: "Open"
      }
    ]);

    setTickets([
      {
        id: 1,
        student_name: "Student 2",
        issue_type: "Aadhaar mismatch",
        status: "Open",
        assigned_official: "Official 1"
      }
    ]);
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInstitutionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save to database
      let savedInstitution;
      
      if (institutionData.id) {
        // Update existing institution
        savedInstitution = await apiService.updateInstitution(institutionData.id, institutionData);
        console.log('Institution updated:', savedInstitution);
      } else {
        // Create new institution
        savedInstitution = await apiService.createInstitution(institutionData);
        console.log('Institution created:', savedInstitution);
      }
      
      // Update local state with the saved data (including ID)
      setInstitutionData(savedInstitution);
      
      // Update user data
      const updatedUser = {
        ...currentUser,
        institution_data: savedInstitution
      };
      updateUserData(updatedUser);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving institution data:', error);
      alert('Error saving institution data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🏫 Institution Profile & Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your institution and student data</p>
        </div>

        {/* Institution Profile Form */}
        <Card className="p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={institutionData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter institution name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Code/ID *
                </label>
                <input
                  type="text"
                  name="code"
                  value={institutionData.code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter institution code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  name="district"
                  value={institutionData.district}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter district"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Panchayat
                </label>
                <input
                  type="text"
                  name="panchayat"
                  value={institutionData.panchayat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter panchayat"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  name="contact_person_name"
                  value={institutionData.contact_person_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person Mobile *
                </label>
                <input
                  type="tel"
                  name="contact_person_mobile"
                  value={institutionData.contact_person_mobile}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person Email *
                </label>
                <input
                  type="email"
                  name="contact_person_email"
                  value={institutionData.contact_person_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Students Enrolled
                </label>
                <input
                  type="number"
                  name="total_students"
                  value={institutionData.total_students}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter total students"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-6">
              <div className="text-sm text-gray-500">
                * Required fields
              </div>
              <div className="flex gap-4">
                {saved && (
                  <span className="text-green-600 text-sm font-medium">
                    ✓ Saved successfully!
                  </span>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2"
                >
                  {loading ? 'Saving...' : 'Save Institution Profile'}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Dashboard Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{institutionData.total_students}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">DBT Enabled</p>
                <p className="text-2xl font-bold text-gray-900">75</p>
                <p className="text-sm text-gray-500">50%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">DBT Pending</p>
                <p className="text-2xl font-bold text-gray-900">75</p>
                <p className="text-sm text-gray-500">50%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tickets Raised</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Student List Table */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📋 Student List</h2>
            <Button>Export Report</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DBT Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhaar Linked</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.student_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={student.dbt_status === "Enabled" ? "success" : "warning"}>
                        {student.dbt_status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={student.aadhaar_linked ? "success" : "destructive"}>
                        {student.aadhaar_linked ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={student.bank_account_seeded ? "success" : "destructive"}>
                        {student.bank_account_seeded ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={student.ticket_status === "None" ? "secondary" : "destructive"}>
                        {student.ticket_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Tickets Section Table */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🎟 Tickets Section</h2>
            <Button>Raise New Ticket</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Official</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{ticket.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.student_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.issue_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="destructive">{ticket.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.assigned_official}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button>Send Reminder to Students</Button>
          <Button variant="outline">Export Student Report (CSV)</Button>
          <Button variant="outline">Export Student Report (PDF)</Button>
        </div>

        {/* Next Steps Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Next Steps
          </h3>
          <p className="text-blue-700">
            Once you complete your institution profile, you'll be able to:
          </p>
          <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
            <li>Get personalized scholarship recommendations for your students</li>
            <li>View institution-specific community insights</li>
            <li>Track DBT enrollment progress for your students</li>
            <li>Access institution management tools</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstitutionProfile;
