export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mecare-backend.onrender.com';

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/api/admin/login`,
    
    // Doctor endpoints
    DOCTORS: `${API_BASE_URL}/api/doctors`,
    TOP_DOCTORS: `${API_BASE_URL}/api/doctors/top6`,
    DOCTOR_BY_ID: (id: string) => `${API_BASE_URL}/api/doctors/${id}`,
    DOCTORS_BY_SPECIALIZATION: (specialization: string) => `${API_BASE_URL}/api/doctors/specialization/${specialization}`,
    
    // Appointment endpoints
    APPOINTMENTS: `${API_BASE_URL}/api/appointments`,
    APPOINTMENT_BY_ID: (id: string) => `${API_BASE_URL}/api/appointments/${id}`,
    APPOINTMENT_DETAILS: (id: string) => `${API_BASE_URL}/api/appointments/details/${id}`,
    
    // Review endpoints
    REVIEWS: `${API_BASE_URL}/api/reviews`,
    REVIEWS_BY_DOCTOR: (doctorId: string) => `${API_BASE_URL}/api/reviews/${doctorId}`,
    REVIEWS_BY_USER: (userId: string) => `${API_BASE_URL}/api/reviews/${userId}`,
    
    // Other endpoints
    DISEASE: `${API_BASE_URL}/api/disease`,
    SLOTS: (doctorId: string) => `${API_BASE_URL}/api/slots/${doctorId}`,
    USERS:(id: string) => `${API_BASE_URL}/api/users/${id}`,
}; 