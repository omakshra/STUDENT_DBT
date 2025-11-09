import React, { useState } from "react";
import scholarships from "../data/Scholarship.json"; // ✅ Import JSON
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  User,
  Award,
  FileText,
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

const Scholarships = ({ language }) => {
  const [filter, setFilter] = useState("all");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [expandedScholarship, setExpandedScholarship] = useState(null);

  // ✅ Age filter ranges
  const checkAgeFilter = (ageRange, filter) => {
    if (filter === "all") return true;
    if (!ageRange || ageRange.length !== 2) return false;

    const [minAge, maxAge] = ageRange;

    switch (filter) {
      case "<18":
        return minAge < 18;
      case "18-25":
        return minAge <= 25 && maxAge >= 18;
      case "25+":
        return maxAge >= 25;
      default:
        return true;
    }
  };

  // ✅ Multi-filter logic
  const filteredScholarships = scholarships.filter((scholarship) => {
    let matchesCategory =
      filter === "all" || scholarship.category === filter;

    let matchesField =
      fieldFilter === "all" || scholarship.field === fieldFilter;

    let matchesAge = checkAgeFilter(scholarship.ageRange, ageFilter);

    let matchesGender =
      genderFilter === "all" || scholarship.gender === genderFilter;

    return matchesCategory && matchesField && matchesAge && matchesGender;
  });

  // ✅ Sum eligible scholarship amounts (safe for ranges/strings)
  const totalAmount = scholarships
    .filter((s) => s.eligible)
    .reduce((sum, s) => {
      const numeric = parseInt(s.amount.replace(/[₹,]/g, ""));
      return sum + (isNaN(numeric) ? 0 : numeric);
    }, 0);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "merit":
        return Award;
      case "need-based":
        return DollarSign;
      case "technical":
        return FileText;
      case "minority":
        return User;
      default:
        return Award;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "merit":
        return "bg-blue-100 text-blue-800";
      case "need-based":
        return "bg-green-100 text-green-800";
      case "technical":
        return "bg-purple-100 text-purple-800";
      case "minority":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">
          {language === "en"
            ? "Scholarship Opportunities"
            : "छात्रवृत्ति अवसर"}
        </h1>
        <p className="text-green-100">
          {language === "en"
            ? "Discover and apply for scholarships that match your profile"
            : "अपनी प्रोफ़ाइल से मेल खाने वाली छात्रवृत्ति खोजें और आवेदन करें"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {scholarships.filter((s) => s.eligible).length}
          </div>
          <div className="text-gray-600">
            {language === "en"
              ? "Available  Scholarships"
              : "पात्र छात्रवृत्ति"}
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            ₹{totalAmount.toLocaleString()}
          </div>
          <div className="text-gray-600">
            {language === "en" ? "Potential Earnings" : "संभावित कमाई"}
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            {scholarships.filter((s) => !s.eligible).length}
          </div>
          <div className="text-gray-600">
            {language === "en" ? "Missing Requirements" : "गुम दस्तावेज"}
          </div>
        </Card>
      </div>

      {/* Filters Section */}
      <Card>
        <div className="p-6 space-y-6">
          {/* Category Filter */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {language === "en"
                ? "Filter by Category"
                : "श्रेणी अनुसार फ़िल्टर"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All" },
                { key: "merit", label: "Merit-based" },
                { key: "need-based", label: "Need-based" },
                { key: "technical", label: "Technical" },
                { key: "minority", label: "Minority" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Field Filter */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {language === "en"
                ? "Filter by Field"
                : "क्षेत्र अनुसार फ़िल्टर"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "all",
                "engineering",
                "medical",
                "science",
                "sports",
                "general",
              ].map((field) => (
                <button
                  key={field}
                  onClick={() => setFieldFilter(field)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    fieldFilter === field
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Age Filter */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {language === "en"
                ? "Filter by Age"
                : "आयु अनुसार फ़िल्टर"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {["all", "<18", "18-25", "25+"].map((range) => (
                <button
                  key={range}
                  onClick={() => setAgeFilter(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    ageFilter === range
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {language === "en"
                ? "Filter by Gender"
                : "लिंग अनुसार फ़िल्टर"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {["all", "male", "female"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    genderFilter === g
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Scholarship List */}
      <div className="space-y-4">
        {filteredScholarships.map((scholarship) => {
          const CategoryIcon = getCategoryIcon(scholarship.category);
          const isExpanded = expandedScholarship === scholarship.id;

          return (
            <Card
              key={scholarship.id}
              className={`transition-all duration-300 cursor-pointer hover:shadow-lg ${
                isExpanded ? "ring-2 ring-blue-500 shadow-lg" : ""
              }`}
              onClick={() =>
                setExpandedScholarship(
                  isExpanded ? null : scholarship.id
                )
              }
            >
              <div className="p-6">
                {/* Basic Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CategoryIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        {scholarship.name}
                      </h3>
                      <Badge
                        className={getCategoryColor(scholarship.category)}
                      >
                        {scholarship.category}
                      </Badge>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          scholarship.eligible
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {scholarship.eligible
                          ? language === "en"
                            ? "Eligible"
                            : "पात्र"
                          : language === "en"
                          ? "Not Eligible"
                          : "अपात्र"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {scholarship.provider}
                    </p>
                    <p className="text-gray-700">
                      {scholarship.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {scholarship.amount}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {language === "en" ? "Deadline:" : "अंतिम तिथि:"}{" "}
                      {scholarship.deadline}
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                {isExpanded && (
                  <div className="mt-6 border-t pt-6 space-y-6">
                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
                        <Award className="w-5 h-5" />
                        {language === "en" ? "Benefits" : "लाभ"}
                      </h4>
                      <ul className="space-y-2">
                        {scholarship.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-700">
                        <FileText className="w-5 h-5" />
                        {language === "en"
                          ? "Requirements"
                          : "आवश्यकताएं"}
                      </h4>
                      <ul className="space-y-2">
                        {scholarship.requirements.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Steps */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-700">
                        <Clock className="w-5 h-5" />
                        {language === "en"
                          ? "Application Steps"
                          : "आवेदन चरण"}
                      </h4>
                      <div className="space-y-3">
                        {scholarship.applicationSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3"
                          >
                            <div className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                              {idx + 1}
                            </div>
                            <p className="text-sm text-gray-700">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Link to Official Website */}
                    <div>
                      <a
                        href={scholarship.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition-colors"
                      >
                        {language === "en"
                          ? "View Scholarship / Apply"
                          : "विवरण देखें / आवेदन करें"}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Scholarships;