import api from './api';

export interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  createdBy: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
}

class EventService {
  async getAllEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events');
    return response.data;
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events/upcoming');
    return response.data;
  }

  async getPastEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events/past');
    return response.data;
  }

  async getEventById(id: string): Promise<Event> {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  }

  async createEvent(data: CreateEventRequest): Promise<Event> {
    const response = await api.post<Event>('/faculty/events', data);
    return response.data;
  }

  async updateEvent(id: string, data: Partial<CreateEventRequest>): Promise<Event> {
    const response = await api.put<Event>(`/faculty/events/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/faculty/events/${id}`);
  }

  async getEventsByFaculty(facultyId: string): Promise<Event[]> {
    const response = await api.get<Event[]>(`/faculty/events`);
    return response.data;
  }
}

export default new EventService();
