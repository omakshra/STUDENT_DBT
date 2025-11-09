import React, { useState } from 'react';
import { MapPin, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

const InteractiveMap = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  // Mock data for DBT statistics by state
  const stateData = {
    'Rajasthan': { enabled: 65, notEnabled: 35, total: 1250000, rank: 19 },
    'Maharashtra': { enabled: 78, notEnabled: 22, total: 2100000, rank: 5 },
    'Uttar Pradesh': { enabled: 45, notEnabled: 55, total: 3200000, rank: 28 },
    'Karnataka': { enabled: 82, notEnabled: 18, total: 1800000, rank: 3 },
    'Tamil Nadu': { enabled: 75, notEnabled: 25, total: 1650000, rank: 8 },
    'Gujarat': { enabled: 70, notEnabled: 30, total: 1200000, rank: 12 },
    'West Bengal': { enabled: 38, notEnabled: 62, total: 1900000, rank: 31 },
    'Madhya Pradesh': { enabled: 52, notEnabled: 48, total: 1400000, rank: 25 },
    'Bihar': { enabled: 35, notEnabled: 65, total: 2800000, rank: 33 },
    'Andhra Pradesh': { enabled: 68, notEnabled: 32, total: 1100000, rank: 14 },
    'Telangana': { enabled: 72, notEnabled: 28, total: 950000, rank: 10 },
    'Kerala': { enabled: 88, notEnabled: 12, total: 850000, rank: 2 },
    'Odisha': { enabled: 58, notEnabled: 42, total: 980000, rank: 20 },
    'Punjab': { enabled: 80, notEnabled: 20, total: 750000, rank: 6 },
    'Haryana': { enabled: 85, notEnabled: 15, total: 680000, rank: 4 },
    'Delhi': { enabled: 90, notEnabled: 10, total: 450000, rank: 1 },
    'Himachal Pradesh': { enabled: 77, notEnabled: 23, total: 320000, rank: 7 },
    'Uttarakhand': { enabled: 73, notEnabled: 27, total: 380000, rank: 9 },
    'Jharkhand': { enabled: 48, notEnabled: 52, total: 890000, rank: 26 },
    'Chhattisgarh': { enabled: 55, notEnabled: 45, total: 720000, rank: 22 },
    'Assam': { enabled: 62, notEnabled: 38, total: 1100000, rank: 16 },
    'Jammu and Kashmir': { enabled: 60, notEnabled: 40, total: 580000, rank: 18 },
    'Ladakh': { enabled: 65, notEnabled: 35, total: 45000, rank: 15 },
    'Goa': { enabled: 85, notEnabled: 15, total: 120000, rank: 11 },
    'Sikkim': { enabled: 70, notEnabled: 30, total: 85000, rank: 13 },
    'Arunachal Pradesh': { enabled: 45, notEnabled: 55, total: 180000, rank: 29 },
    'Nagaland': { enabled: 50, notEnabled: 50, total: 220000, rank: 24 },
    'Manipur': { enabled: 48, notEnabled: 52, total: 190000, rank: 27 },
    'Meghalaya': { enabled: 55, notEnabled: 45, total: 250000, rank: 21 },
    'Tripura': { enabled: 58, notEnabled: 42, total: 280000, rank: 17 },
    'Mizoram': { enabled: 62, notEnabled: 38, total: 150000, rank: 23 },
    'Andaman and Nicobar Islands': { enabled: 75, notEnabled: 25, total: 45000, rank: 30 },
    'Lakshadweep': { enabled: 80, notEnabled: 20, total: 12000, rank: 32 },
    'Puducherry': { enabled: 78, notEnabled: 22, total: 85000, rank: 34 },
    'Chandigarh': { enabled: 92, notEnabled: 8, total: 95000, rank: 35 },
    'Dadra and Nagar Haveli and Daman and Diu': { enabled: 68, notEnabled: 32, total: 65000, rank: 36 }
  };

  const getStateColor = (stateName) => {
    const data = stateData[stateName];
    if (!data) return '#e5e7eb';
    
    const percentage = data.enabled;
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 60) return '#f59e0b'; // Yellow
    if (percentage >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getStateOpacity = (stateName) => {
    if (hoveredState === stateName) return 0.8;
    if (selectedState === stateName) return 0.9;
    return 0.6;
  };

  const handleStateClick = (stateName) => {
    setSelectedState(selectedState === stateName ? null : stateName);
  };

  const handleStateHover = (stateName) => {
    setHoveredState(stateName);
  };

  const clearHover = () => {
    setHoveredState(null);
  };

  // Rough absolute-position anchors (percentage from container's top-left)
  const statePositions = {
    'Jammu and Kashmir': { top: 6, left: 34 },
    'Ladakh': { top: 5, left: 41 },
    'Punjab': { top: 15, left: 33 },
    'Himachal Pradesh': { top: 12, left: 38 },
    'Haryana': { top: 18, left: 39 },
    'Delhi': { top: 19, left: 41 },
    'Rajasthan': { top: 26, left: 30 },
    'Uttar Pradesh': { top: 25, left: 48 },
    'Uttarakhand': { top: 20, left: 45 },
    'Gujarat': { top: 40, left: 26 },
    'Madhya Pradesh': { top: 40, left: 40 },
    'Bihar': { top: 32, left: 57 },
    'Jharkhand': { top: 40, left: 60 },
    'West Bengal': { top: 42, left: 68 },
    'Odisha': { top: 50, left: 58 },
    'Chhattisgarh': { top: 48, left: 49 },
    'Maharashtra': { top: 55, left: 37 },
    'Telangana': { top: 60, left: 45 },
    'Andhra Pradesh': { top: 69, left: 50 },
    'Karnataka': { top: 66, left: 36 },
    'Tamil Nadu': { top: 80, left: 44 },
    'Kerala': { top: 80, left: 36 },
    'Goa': { top: 66, left: 32 },
    'Sikkim': { top: 32, left: 64 },
    'Assam': { top: 35, left: 73 },
    'Meghalaya': { top: 40, left: 70 },
    'Tripura': { top: 46, left: 74 },
    'Manipur': { top: 44, left: 77 },
    'Mizoram': { top: 50, left: 76 },
    'Nagaland': { top: 40, left: 78 },
    'Arunachal Pradesh': { top: 28, left: 79 },
    'Andaman and Nicobar Islands': { top: 92, left: 65 },
    'Lakshadweep': { top: 86, left: 18 },
    'Puducherry': { top: 84, left: 49 },
    'Chandigarh': { top: 18, left: 37 },
    'Dadra and Nagar Haveli and Daman and Diu': { top: 48, left: 28 }
  };

  // Calculate total statistics
  const totalStats = Object.values(stateData).reduce(
    (acc, state) => ({
      totalStudents: acc.totalStudents + state.total,
      totalEnabled: acc.totalEnabled + Math.round((state.total * state.enabled) / 100),
      totalNotEnabled: acc.totalNotEnabled + Math.round((state.total * state.notEnabled) / 100)
    }),
    { totalStudents: 0, totalEnabled: 0, totalNotEnabled: 0 }
  );

  const overallPercentage = Math.round((totalStats.totalEnabled / totalStats.totalStudents) * 100);

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-blue-500" />
            DBT Coverage Across India
          </h2>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Live Data
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {totalStats.totalStudents.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {totalStats.totalEnabled.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">DBT Enabled</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {totalStats.totalNotEnabled.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Not Enabled</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {overallPercentage}%
            </div>
            <p className="text-sm text-gray-600">Overall Coverage</p>
          </div>
        </div>
      </Card>

      {/* Interactive Map */}
      <Card className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">State-wise DBT Statistics</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span>80%+ Coverage</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span>60-79% Coverage</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
              <span>40-59% Coverage</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span>Below 40%</span>
            </div>
          </div>
        </div>
        {/* Map + Overlay markers */}
        <div className="relative w-full max-w-5xl mx-auto">
          <img
            src="/assets/in.svg"
            alt="India Map"
            className="w-full h-auto select-none pointer-events-none rounded"
            draggable={false}
          />

          {Object.entries(statePositions).map(([stateName, pos]) => (
            <button
              key={stateName}
              type="button"
              onClick={() => handleStateClick(stateName)}
              onMouseEnter={() => handleStateHover(stateName)}
              onMouseLeave={clearHover}
              style={{ top: `${pos.top}%`, left: `${pos.left}%`, opacity: getStateOpacity(stateName) }}
              className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            >
              <span
                className="block w-4 h-4 rounded-full ring-2 ring-white shadow"
                style={{ backgroundColor: getStateColor(stateName) }}
                aria-label={stateName}
                title={`${stateName}: ${stateData[stateName]?.enabled ?? '-'}%`}
              />
            </button>
          ))}

          {hoveredState && statePositions[hoveredState] && (
            <div
              className="absolute bg-white text-xs text-gray-700 px-2 py-1 rounded shadow border"
              style={{
                top: `calc(${statePositions[hoveredState].top}% - 12px)`,
                left: `calc(${statePositions[hoveredState].left}% + 10px)`
              }}
            >
              <span className="font-semibold">{hoveredState}</span>{' '}
              <span>• {stateData[hoveredState]?.enabled ?? '-'}% enabled</span>
            </div>
          )}
        </div>
        {/* State Details Panel */}
        {selectedState && stateData[selectedState] && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-6 max-w-sm border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">{selectedState}</h4>
                <button
                  onClick={() => setSelectedState(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rank</span>
                  <Badge variant="secondary">#{stateData[selectedState].rank}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Students</span>
                  <span className="font-semibold">{stateData[selectedState].total.toLocaleString()}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">DBT Enabled</span>
                    <span className="font-semibold text-green-600">
                      {stateData[selectedState].enabled}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stateData[selectedState].enabled}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Not Enabled</span>
                    <span className="font-semibold text-red-600">
                      {stateData[selectedState].notEnabled}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stateData[selectedState].notEnabled}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </Card>

      {/* Top Performing States */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
          Top Performing States
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stateData)
            .sort((a, b) => b[1].enabled - a[1].enabled)
            .slice(0, 6)
            .map(([state, data], index) => (
              <div key={state} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{state}</p>
                    <p className="text-sm text-gray-600">{data.total.toLocaleString()} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{data.enabled}%</p>
                  <p className="text-xs text-gray-500">DBT Enabled</p>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default InteractiveMap;
