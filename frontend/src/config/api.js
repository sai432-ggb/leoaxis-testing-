// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://leoaxis-backend.onrender.com/api');

export default API_BASE_URL;

// API Endpoints
export const ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  GET_PROFILE: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  GET_STATS: '/auth/stats',
  
  // Courses
  GET_COURSES: '/courses',
  GET_COURSE_BY_ID: (id) => `/courses/${id}`,
  ENROLL_COURSE: (id) => `/courses/${id}/enroll`,
  GET_MY_COURSES: '/courses/my-courses/enrolled',
  GET_COURSE_TOPICS: (id) => `/courses/${id}/topics`,
  GET_QUIZ: (courseId, topicId) => `/courses/${courseId}/topics/${topicId}/quiz`,
  SUBMIT_QUIZ: (courseId, topicId) => `/courses/${courseId}/topics/${topicId}/quiz/submit`,
  
  // AI
  ANALYZE_QUIZ: '/ai/analyze-quiz',
  LEARNING_PATH: '/ai/learning-path',
  RESOLVE_DOUBT: '/ai/doubt'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Please login to continue.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  ENROLLMENT: 'Successfully enrolled in course!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  PASSWORD_CHANGE: 'Password changed successfully!'
};
