// frontend/services/apiService.js
import { supabase } from "./supabaseclient"; // v2 Supabase client
const API_BASE_URL = "http://localhost:8000/api";

// ----------------------
// Token & Auth Helpers
// ----------------------
const getTokenHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("User not authenticated");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

const isAuthenticated = () => !!localStorage.getItem("access_token");

const getCurrentUser = () => {
  try {
    const savedUser = localStorage.getItem("current_user");
    if (!savedUser) return null;

    const user = JSON.parse(savedUser);

    // Ensure numeric ID exists
    if (!user.id && user.user_id) user.id = Number(user.user_id);
    if (!user.id) return null;

    user.id = Number(user.id); // ensure number
    return user;
  } catch (err) {
    console.error("Error parsing current_user:", err);
    return null;
  }
};

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("current_user");
};

// ----------------------
// User Registration
// ----------------------
const register = async ({ username, password, email, role }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, email, password, role }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, error: errorData.detail || "Registration failed" };
    }

    const data = await res.json();
    const token = data.token;
    const user = data.user;

    if (token) localStorage.setItem("access_token", token);
    if (user) localStorage.setItem("current_user", JSON.stringify(user));

    return { success: true, user, token };
  } catch (error) {
    console.error("Register API Error:", error);
    return { success: false, error: "Network error" };
  }
};

// ----------------------
// User Login
// ----------------------
const login = async ({ username, password }) => {
  try {
    const email = username.includes("@") ? username : `${username}@example.com`;
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, error: errorData.detail || "Login failed" };
    }

    const data = await res.json();
    const token = data.token;
    const user = data.user;

    if (token) localStorage.setItem("access_token", token);
    if (user) localStorage.setItem("current_user", JSON.stringify(user));

    return { success: true, user, token };
  } catch (error) {
    console.error("Login API Error:", error);
    return { success: false, error: "Network error" };
  }
};

// ----------------------
// Student Profile APIs
// ----------------------
const getStudentProfile = async () => {
  try {
    const user = getCurrentUser();
    if (!user || !user.id) throw new Error("User not authenticated or invalid user ID");

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("user_id", Number(user.id))
      .maybeSingle();

    if (error) throw error;

    const allowedKeys = [
      "name","email","phone","gender","category","aadhaar",
      "college_name","course","year_of_study","cgpa",
      "dbt_status","family_income","bank_account","ifsc_code",
      "district","state","user_id"
    ];

    const filteredData = {};
    if (data) {
      allowedKeys.forEach(key => {
        if (data[key] !== undefined) filteredData[key] = data[key];
      });
    }

    return filteredData;
  } catch (err) {
    console.error("Get Student Profile Error:", err);
    throw err;
  }
};

const updateStudentProfile = async (profileData) => {
  try {
    const user = getCurrentUser();
    if (!user || !user.id) throw new Error("User not authenticated or invalid user ID");

    const allowedKeys = [
      "name","email","phone","gender","category","aadhaar",
      "college_name","course","year_of_study","cgpa",
      "dbt_status","family_income","bank_account","ifsc_code",
      "district","state"
    ];

    const filteredData = {};
    allowedKeys.forEach(key => {
      let value = profileData[key];
      if (typeof value === "string") value = value.trim();
      if ((key === "cgpa" || key === "family_income") && (!value || value === "")) value = null;
      if (value !== undefined) filteredData[key] = value;
    });

    filteredData.user_id = Number(user.id);

    const { data, error } = await supabase
      .from("students")
      .upsert([filteredData], {
        onConflict: "user_id",
        returning: "representation"
      });

    if (error) {
      console.error("Supabase Upsert Error:", error);
      throw new Error(error.message || "Failed to upsert student profile");
    }

    // Use updated row if available, otherwise fallback to filteredData
    const updatedProfile = data && data[0] ? data[0] : filteredData;

    // Update local storage safely, keep id intact
    const currentUser = getCurrentUser() || {};
    updateUserData({ ...currentUser, ...updatedProfile, id: currentUser.id || updatedProfile.user_id });

    return updatedProfile;
  } catch (err) {
    console.error("Update Student Profile Error:", err);
    throw err;
  }
};

// ----------------------
// Update user data locally
// ----------------------
const updateUserData = (userData) => {
  if (!userData) return null;
  localStorage.setItem("current_user", JSON.stringify(userData));
  return userData;
};

export default {
  getStudentProfile,
  updateStudentProfile,
  isAuthenticated,
  getCurrentUser,
  logout,
  updateUserData,
};

export { register, login };
