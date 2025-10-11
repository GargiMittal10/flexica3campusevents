import api from './api';

export interface EventRegistration {
  id: string;
  event: {
    id: string;
    title: string;
    eventDate: string;
    location?: string;
  };
  student: {
    id: string;
    fullName: string;
  };
  registeredAt: string;
}

class RegistrationService {
  async registerForEvent(eventId: string): Promise<void> {
    await api.post(`/student/events/${eventId}/register`);
  }

  async unregisterFromEvent(eventId: string): Promise<void> {
    await api.delete(`/student/events/${eventId}/register`);
  }

  async getMyRegistrations(): Promise<EventRegistration[]> {
    const response = await api.get<EventRegistration[]>('/student/registrations');
    return response.data;
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    const response = await api.get<EventRegistration[]>(`/faculty/events/${eventId}/registrations`);
    return response.data;
  }

  async isRegistered(eventId: string): Promise<boolean> {
    try {
      const response = await api.get<{ registered: boolean }>(`/student/events/${eventId}/is-registered`);
      return response.data.registered;
    } catch (error) {
      return false;
    }
  }
}

export default new RegistrationService();
