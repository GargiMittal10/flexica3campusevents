import authService from './authService';

class QRService {
  generateQRData(): string {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate QR data in format: STUDENT:userId:studentId:timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    const data = `STUDENT:${user.id}:${user.id}:${timestamp}`;
    
    return btoa(data); // Base64 encode
  }

  parseQRData(qrData: string): { studentId: string; timestamp: number } | null {
    try {
      const decoded = atob(qrData); // Base64 decode
      const parts = decoded.split(':');
      
      if (parts.length !== 4 || parts[0] !== 'STUDENT') {
        return null;
      }

      return {
        studentId: parts[1],
        timestamp: parseInt(parts[3]),
      };
    } catch (error) {
      return null;
    }
  }

  isQRValid(qrData: string): boolean {
    const parsed = this.parseQRData(qrData);
    if (!parsed) return false;

    // Check if QR code is not older than 5 minutes
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 300; // 5 minutes in seconds
    
    return (now - parsed.timestamp) <= maxAge;
  }
}

export default new QRService();
