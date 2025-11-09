// API service for DBT Student Portal
const API_BASE_URL = "http://localhost:8000"
import studentDatabase from "../data/studentDatabase.json"

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
    this.TOKEN_REFRESH_INTERVAL = 25 * 60 * 1000 // 25 minutes in milliseconds
    this.sessionTimer = null
    this.refreshTimer = null

    this.initializeSessionManagement()
  }

  initializeSessionManagement() {
    // Listen for storage changes across tabs
    window.addEventListener("storage", this.handleStorageChange.bind(this))

    // Start session timeout if user is authenticated
    if (this.isAuthenticated()) {
      this.startSessionTimeout()
      this.startTokenRefresh()
    }
  }

  handleStorageChange(event) {
    if (event.key === "authToken") {
      if (!event.newValue) {
        // Token was removed in another tab, logout current tab
        this.handleSessionExpired()
      }
    }
  }

  startSessionTimeout() {
    this.clearSessionTimeout()
    this.sessionTimer = setTimeout(() => {
      this.handleSessionExpired()
    }, this.SESSION_TIMEOUT)
  }

  clearSessionTimeout() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer)
      this.sessionTimer = null
    }
  }

  startTokenRefresh() {
    this.clearTokenRefresh()
    this.refreshTimer = setTimeout(() => {
      this.refreshToken()
    }, this.TOKEN_REFRESH_INTERVAL)
  }

  clearTokenRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  handleSessionExpired() {
    this.logout()
    // Dispatch custom event for components to listen to
    window.dispatchEvent(
      new CustomEvent("sessionExpired", {
        detail: { reason: "Session timeout" },
      }),
    )
  }

  async refreshToken() {
    try {
      const currentToken = localStorage.getItem("authToken")
      if (!currentToken) return

      // In a real implementation, this would call a refresh endpoint
      // For demo purposes, we'll extend the current session
      const response = await this.request("/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })

      if (response.token) {
        localStorage.setItem("authToken", response.token)
        this.startTokenRefresh() // Schedule next refresh
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
      // For demo, just extend the session
      this.startTokenRefresh()
    }
  }

  resetSessionActivity() {
    if (this.isAuthenticated()) {
      this.startSessionTimeout()
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Handle PDF responses
      if (response.headers.get("content-type")?.includes("application/pdf")) {
        return response.blob()
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Scholarship Recommendations
  async getScholarshipRecommendations(studentProfile, preferences = {}) {
    return this.request("/api/scholarships/recommendations", {
      method: "POST",
      body: JSON.stringify({
        student_profile: studentProfile,
        preferences: preferences,
      }),
    })
  }

  // Get all scholarships
  async getAllScholarships() {
    return this.request("/api/scholarships/all")
  }

  // Get specific scholarship details
  async getScholarshipDetails(scholarshipId) {
    return this.request(`/api/scholarships/${scholarshipId}`)
  }

  // Validate student profile
  async validateStudentProfile(profile) {
    return this.request("/api/student/profile/validate", {
      method: "POST",
      body: JSON.stringify(profile),
    })
  }

  // Generate PDF report
  async generateRecommendationsPDF(studentProfile, recommendations) {
    const response = await fetch(`${this.baseURL}/api/pdf/generate-recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_profile: studentProfile,
        recommendations: recommendations,
      }),
    })

    if (!response.ok) {
      throw new Error(`PDF generation failed: ${response.status}`)
    }

    return response.blob()
  }

  // Get sample PDF
  async getSamplePDF() {
    const response = await fetch(`${this.baseURL}/api/pdf/sample`)

    if (!response.ok) {
      throw new Error(`Sample PDF generation failed: ${response.status}`)
    }

    return response.blob()
  }

  // Get dashboard analytics
  async getDashboardAnalytics() {
    return this.request("/api/analytics/dashboard")
  }

  // Health check
  async healthCheck() {
    return this.request("/")
  }

  // Institution API methods
  async createInstitution(institutionData) {
    return this.request("/api/institutions/", {
      method: "POST",
      body: JSON.stringify(institutionData),
    })
  }

  async getAllInstitutions() {
    return this.request("/api/institutions/")
  }

  async getInstitution(institutionId) {
    return this.request(`/api/institutions/${institutionId}`)
  }

  async updateInstitution(institutionId, institutionData) {
    return this.request(`/api/institutions/${institutionId}`, {
      method: "PUT",
      body: JSON.stringify(institutionData),
    })
  }

  async deleteInstitution(institutionId) {
    return this.request(`/api/institutions/${institutionId}`, {
      method: "DELETE",
    })
  }

  // Authentication methods
  async login(credentials) {
    try {
      // First try backend API
      const response = await this.request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })

      // Store token and user data
      if (response.token) {
        localStorage.setItem("authToken", response.token)
        localStorage.setItem("userData", JSON.stringify(response.user))
        localStorage.setItem("sessionTimestamp", Date.now().toString())

        this.startSessionTimeout()
        this.startTokenRefresh()
      }

      return response
    } catch (error) {
      // Fallback to JSON database
      const user = studentDatabase.students.find(
        student => 
          (student.username === credentials.username || student.email === credentials.username) &&
          student.password === credentials.password
      )

      if (user) {
        const token = "demo-token-" + Date.now()
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          studentId: user.username,
          phone: user.phone,
          gender: user.gender,
          category: user.category,
          father_name: user.father_name,
          mother_name: user.mother_name,
          dob: user.dob,
          address: user.address,
          district: user.district,
          state: user.state,
          college_name: user.college_name,
          course: user.course,
          year_of_study: user.year_of_study,
          cgpa: user.cgpa,
          family_income: user.family_income,
          bank_account: user.bank_account,
          ifsc_code: user.ifsc_code,
          dbt_status: user.dbt_status,
          aadhaar: user.aadhaar,
          disabilities: user.disabilities,
          achievements: user.achievements,
          extracurricular: user.extracurricular,
          avatar: user.avatar
        }

        localStorage.setItem("authToken", token)
        localStorage.setItem("userData", JSON.stringify(userData))
        localStorage.setItem("sessionTimestamp", Date.now().toString())

        this.startSessionTimeout()
        this.startTokenRefresh()

        return {
          success: true,
          token: token,
          user: userData,
        }
      } else {
        throw new Error("Invalid credentials")
      }
    }
  }

  async register(userData) {
    try {
      // First try backend API
      const response = await this.request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      })

      if (response.token) {
        localStorage.setItem("authToken", response.token)
        localStorage.setItem("userData", JSON.stringify(response.user))
        localStorage.setItem("sessionTimestamp", Date.now().toString())

        this.startSessionTimeout()
        this.startTokenRefresh()
      }

      return response
    } catch (error) {
      // Fallback - create new user in JSON database
      const newUser = {
        id: "STU" + Math.floor(Math.random() * 1000),
        username: userData.username,
        password: userData.password,
        email: userData.email || `${userData.username}@example.com`,
        name: userData.name || userData.username,
        phone: userData.phone || "",
        gender: userData.gender || "Male",
        category: userData.category || "General",
        father_name: userData.father_name || "",
        mother_name: userData.mother_name || "",
        dob: userData.dob || "",
        address: userData.address || "",
        district: userData.district || "",
        state: userData.state || "",
        college_name: userData.college_name || "",
        course: userData.course || "",
        year_of_study: userData.year_of_study || "1st Year",
        cgpa: userData.cgpa || 0,
        family_income: userData.family_income || 0,
        bank_account: userData.bank_account || "",
        ifsc_code: userData.ifsc_code || "",
        dbt_status: "Not Active",
        aadhaar: userData.aadhaar || "",
        disabilities: [],
        achievements: [],
        extracurricular: [],
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      }

      // Add to database (in real app, this would be saved to backend)
      studentDatabase.students.push(newUser)

      const token = "demo-token-" + Date.now()
      const userDataForStorage = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        studentId: newUser.username,
        phone: newUser.phone,
        gender: newUser.gender,
        category: newUser.category,
        father_name: newUser.father_name,
        mother_name: newUser.mother_name,
        dob: newUser.dob,
        address: newUser.address,
        district: newUser.district,
        state: newUser.state,
        college_name: newUser.college_name,
        course: newUser.course,
        year_of_study: newUser.year_of_study,
        cgpa: newUser.cgpa,
        family_income: newUser.family_income,
        bank_account: newUser.bank_account,
        ifsc_code: newUser.ifsc_code,
        dbt_status: newUser.dbt_status,
        aadhaar: newUser.aadhaar,
        disabilities: newUser.disabilities,
        achievements: newUser.achievements,
        extracurricular: newUser.extracurricular,
        avatar: newUser.avatar
      }

      localStorage.setItem("authToken", token)
      localStorage.setItem("userData", JSON.stringify(userDataForStorage))
      localStorage.setItem("sessionTimestamp", Date.now().toString())

      this.startSessionTimeout()
      this.startTokenRefresh()

      return {
        success: true,
        token: token,
        user: userDataForStorage,
      }
    }
  }

  logout() {
    this.clearSessionTimeout()
    this.clearTokenRefresh()

    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("sessionTimestamp")
  }

  getCurrentUser() {
    const userData = localStorage.getItem("userData")
    return userData ? JSON.parse(userData) : null
  }

  isAuthenticated() {
    const token = localStorage.getItem("authToken")
    const sessionTimestamp = localStorage.getItem("sessionTimestamp")

    if (!token || !sessionTimestamp) {
      return false
    }

    const sessionAge = Date.now() - Number.parseInt(sessionTimestamp)
    if (sessionAge > this.SESSION_TIMEOUT) {
      this.logout()
      return false
    }

    return true
  }

  updateUserData(userData) {
    const currentUser = this.getCurrentUser()
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData }
      localStorage.setItem("userData", JSON.stringify(updatedUser))
      return updatedUser
    }
    return null
  }

  getSessionInfo() {
    const sessionTimestamp = localStorage.getItem("sessionTimestamp")
    if (!sessionTimestamp) return null

    const sessionAge = Date.now() - Number.parseInt(sessionTimestamp)
    const timeRemaining = Math.max(0, this.SESSION_TIMEOUT - sessionAge)

    return {
      sessionAge,
      timeRemaining,
      expiresAt: new Date(Number.parseInt(sessionTimestamp) + this.SESSION_TIMEOUT),
    }
  }
}

// Create singleton instance
const apiService = new APIService()

export default apiService

// Named exports for specific functions
export const {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  getScholarshipRecommendations,
  getAllScholarships,
  getScholarshipDetails,
  validateStudentProfile,
  generateRecommendationsPDF,
  getSamplePDF,
  getDashboardAnalytics,
  healthCheck,
  updateUserData,
  getSessionInfo,
} = apiService
