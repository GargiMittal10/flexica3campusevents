import api from './api';

export interface Attendance {
  id: string;
  event: {
    id: string;
    title: string;
    eventDate: string;
  };
  student: {
    id: string;
    fullName: string;
    studentId: string;
  };
  markedBy: {
    id: string;
    fullName: string;
  };
  qrData?: string;
  markedAt: string;
}

export interface MarkAttendanceRequest {
  eventId: string;
  qrData: string;
}

class AttendanceService {
  async markAttendance(data: MarkAttendanceRequest): Promise<Attendance> {
    const response = await api.post<Attendance>('/faculty/attendance/mark', data);
    return response.data;
  }

  async getEventAttendance(eventId: string): Promise<Attendance[]> {
    const response = await api.get<Attendance[]>(`/faculty/events/${eventId}/attendance`);
    return response.data;
  }

  async getMyAttendance(): Promise<Attendance[]> {
    const response = await api.get<Attendance[]>('/student/attendance');
    return response.data;
  }

  async checkAttendance(eventId: string, studentId: string): Promise<boolean> {
    try {
      const response = await api.get<{ present: boolean }>(
        `/faculty/attendance/check?eventId=${eventId}&studentId=${studentId}`
      );
      return response.data.present;
    } catch (error) {
      return false;
    }
  }
}

export default new AttendanceService();
