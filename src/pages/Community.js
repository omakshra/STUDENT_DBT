import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, DoughnutChart } from 'recharts';
import { 
  Users, 
  TrendingUp, 
  School, 
  MapPin,
  Award,
  AlertCircle
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import mockData from '../mockData.json';

const CommunityInsights = ({ currentUser }) => {
  const { districtStats, student } = mockData;
  
  // Check if user is an institution
  const isInstitution = currentUser?.role === 'institution';
  
  // Mock data for charts
  const dbtStatusData = [
    { name: 'DBT Enabled', value: districtStats.dbtEnabled, color: '#10b981' },
    { name: 'Without DBT', value: districtStats.withoutDBT, color: '#f59e0b' }
  ];

  const collegeComparisonData = [
    { college: 'SRM University', dbtEnabled: 85, students: 1200 },
    { college: 'Anna University', dbtEnabled: 78, students: 2000 },
    { college: 'VIT Chennai', dbtEnabled: 92, students: 800 },
    { college: 'Loyola College', dbtEnabled: 71, students: 600 },
    { college: 'Others', dbtEnabled: 65, students: 400 }
  ];

  const monthlyTrendsData = [
    { month: 'Jan', newRegistrations: 120, completedDBT: 89 },
    { month: 'Feb', newRegistrations: 150, completedDBT: 112 },
    { month: 'Mar', newRegistrations: 180, completedDBT: 145 },
    { month: 'Apr', newRegistrations: 210, completedDBT: 178 },
    { month: 'May', newRegistrations: 195, completedDBT: 165 },
    { month: 'Jun', newRegistrations: 230, completedDBT: 198 }
  ];

  const districtWiseData = [
    { district: 'Chennai', percentage: 75 },
    { district: 'Coimbatore', percentage: 68 },
    { district: 'Madurai', percentage: 62 },
    { district: 'Trichy', percentage: 70 },
    { district: 'Salem', percentage: 58 }
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isInstitution ? '🏫 Institution Community Insights' : 'Community Insights'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isInstitution 
              ? `DBT adoption statistics for ${currentUser?.institution_data?.district || student.district} district`
              : `DBT adoption statistics for ${student.district} district`
            }
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
          Updated: Today
        </Badge>
      </div>

      {/* Institution-specific info */}
      {isInstitution && currentUser?.institution_data && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Your Institution Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-700">Institution</p>
              <p className="font-semibold text-blue-900">{currentUser.institution_data.name}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Total Students</p>
              <p className="font-semibold text-blue-900">{currentUser.institution_data.total_students}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Location</p>
              <p className="font-semibold text-blue-900">
                {currentUser.institution_data.district}, {currentUser.institution_data.panchayat}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{districtStats.totalStudents.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">DBT Enabled</p>
              <p className="text-2xl font-bold text-green-600">{districtStats.dbtEnabled}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Colleges Active</p>
              <p className="text-2xl font-bold text-indigo-600">{districtStats.collegeEnabled}%</p>
            </div>
            <School className="h-8 w-8 text-indigo-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your District</p>
              <p className="text-lg font-bold text-gray-900">{student.district}</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DBT Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">DBT Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dbtStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dbtStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {dbtStatusData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </Card>

        {/* College Comparison */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">College-wise DBT Adoption</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collegeComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="college" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dbtEnabled" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly DBT Registration Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="newRegistrations" fill="#3b82f6" radius={[4, 4, 0, 0]} name="New Registrations" />
                <Bar dataKey="completedDBT" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed DBT" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* District Comparison */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">District-wise Performance</h3>
          <div className="space-y-4">
            {districtWiseData.map((district, index) => (
              <div key={district.district} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  </div>
                  <span className={`font-medium ${district.district === student.district ? 'text-blue-600' : 'text-gray-900'}`}>
                    {district.district}
                    {district.district === student.district && (
                      <Badge variant="secondary" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Your District
                      </Badge>
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${district.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 w-12 text-right">
                    {district.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Community Alerts */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Community Alert</h3>
            <p className="text-yellow-700 text-sm mb-3">
              Your district ({student.district}) has {districtStats.withoutDBT}% students without DBT seeding. 
              This means many students might miss out on scholarship opportunities.
            </p>
            <div className="flex space-x-3">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                Help spread awareness
              </Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                Share resources
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CommunityInsights;