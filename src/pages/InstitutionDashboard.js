import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const InstitutionDashboard = () => {
  const [institution, setInstitution] = useState(null);
  const [students, setStudents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now - we'll replace with API calls later
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setInstitution({
        id: 1,
        name: "Sample College",
        code: "SC001",
        district: "Sample District",
        panchayat: "Sample Panchayat",
        contact_person_name: "John Doe",
        contact_person_mobile: "1234567890",
        contact_person_email: "john@example.com",
        total_students: 150
      });

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

      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Institution Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your institution and student data</p>
        </div>

        {/* Institution Profile Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🏫 Institution Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Institution Name</label>
              <p className="text-lg font-semibold">{institution?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Institution Code</label>
              <p className="text-lg font-semibold">{institution?.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-lg">{institution?.district}, {institution?.panchayat}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contact Person</label>
              <p className="text-lg">{institution?.contact_person_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mobile</label>
              <p className="text-lg">{institution?.contact_person_mobile}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg">{institution?.contact_person_email}</p>
            </div>
          </div>
        </Card>

        {/* Key Metrics Cards */}
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
                <p className="text-2xl font-bold text-gray-900">{institution?.total_students}</p>
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

        {/* Student List */}
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

        {/* Tickets Section */}
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
        <div className="flex flex-wrap gap-4">
          <Button>Send Reminder to Students</Button>
          <Button variant="outline">Export Student Report (CSV)</Button>
          <Button variant="outline">Export Student Report (PDF)</Button>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
