import api from './api';

// ==================== TYPES ====================
export interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  status?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  eventId: string;
  studentId: string;
  markedBy: string;
  markedAt: string;
  qrData: string;
}

export interface Feedback {
  id: string;
  eventId: string;
  studentId: string;
  rating: number;
  comment?: string;
  submittedAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  registeredAt: string;
}

// ==================== EVENT SERVICE ====================
class BackendService {
  
  // ========== EVENTS ==========
  async getAllEvents(): Promise<Event[]> {
    const response = await api.get('/events');
    return response.data;
  }

  async getEventById(eventId: string): Promise<Event> {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  }

  async createEvent(data: {
    title: string;
    description?: string;
    eventDate: string;
    location?: string;
  }): Promise<Event> {
    const response = await api.post('/events', data);
    return response.data;
  }

  async updateEvent(eventId: string, data: Partial<Event>): Promise<Event> {
    const response = await api.put(`/events/${eventId}`, data);
    return response.data;
  }

  async deleteEvent(eventId: string): Promise<void> {
    await api.delete(`/events/${eventId}`);
  }

  // ========== REGISTRATIONS ==========
  async registerForEvent(eventId: string): Promise<Registration> {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  }

  async getEventRegistrations(eventId: string): Promise<any[]> {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  }

  // ========== ATTENDANCE ==========
  async markAttendance(data: {
    eventId: string;
    studentId: string;
    qrData: string;
  }): Promise<Attendance> {
    const response = await api.post('/attendance/mark', data);
    return response.data;
  }

  async getEventAttendance(eventId: string): Promise<any[]> {
    const response = await api.get(`/attendance/event/${eventId}`);
    return response.data;
  }

  // ========== ATTENDANCE SESSIONS ==========
  async startAttendanceSession(eventId: string): Promise<any> {
    const response = await api.post('/attendance-sessions/start', {
      event_id: eventId
    });
    return response.data;
  }

  async endAttendanceSession(eventId: string): Promise<any> {
    const response = await api.post('/attendance-sessions/end', {
      event_id: eventId
    });
    return response.data;
  }

  async getActiveAttendanceSession(eventId: string): Promise<any> {
    const response = await api.get(`/attendance-sessions/active/${eventId}`);
    return response.data;
  }

  // ========== FEEDBACK ==========
  async submitFeedback(eventId: string, data: {
    rating: number;
    comment?: string;
  }): Promise<Feedback> {
    const response = await api.post(`/feedback/event/${eventId}`, data);
    return response.data;
  }

  async getEventFeedback(eventId: string): Promise<any[]> {
    const response = await api.get(`/feedback/event/${eventId}`);
    return response.data;
  }

  // ========== FEEDBACK SESSIONS ==========
  async startFeedbackSession(eventId: string): Promise<any> {
    const response = await api.post('/feedback-sessions/start', {
      event_id: eventId
    });
    return response.data;
  }

  async endFeedbackSession(eventId: string): Promise<any> {
    const response = await api.post('/feedback-sessions/end', {
      event_id: eventId
    });
    return response.data;
  }

  async getActiveFeedbackSession(eventId: string): Promise<any> {
    const response = await api.get(`/feedback-sessions/active/${eventId}`);
    return response.data;
  }

  // ========== ANALYTICS ==========
  async getStudentAttendancePercentage(studentId: string): Promise<any> {
    const response = await api.get(`/analytics/student/${studentId}/attendance-percentage`);
    return response.data;
  }

  async getEventParticipationReport(eventId: string): Promise<any> {
    const response = await api.get(`/analytics/event/${eventId}/participation-report`);
    return response.data;
  }
}

export default new BackendService();
