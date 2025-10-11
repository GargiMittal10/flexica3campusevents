import api from './api';

export interface EventFeedback {
  id: string;
  event: {
    id: string;
    title: string;
  };
  student: {
    id: string;
    fullName: string;
  };
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface SubmitFeedbackRequest {
  eventId: string;
  rating: number;
  comment?: string;
}

class FeedbackService {
  async submitFeedback(data: SubmitFeedbackRequest): Promise<EventFeedback> {
    const response = await api.post<EventFeedback>('/student/feedback', data);
    return response.data;
  }

  async getMyFeedback(): Promise<EventFeedback[]> {
    const response = await api.get<EventFeedback[]>('/student/feedback');
    return response.data;
  }

  async getEventFeedback(eventId: string): Promise<EventFeedback[]> {
    const response = await api.get<EventFeedback[]>(`/faculty/events/${eventId}/feedback`);
    return response.data;
  }

  async hasFeedback(eventId: string): Promise<boolean> {
    try {
      const response = await api.get<{ hasFeedback: boolean }>(
        `/student/feedback/check?eventId=${eventId}`
      );
      return response.data.hasFeedback;
    } catch (error) {
      return false;
    }
  }
}

export default new FeedbackService();
