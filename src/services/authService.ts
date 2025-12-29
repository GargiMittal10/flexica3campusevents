import { supabase } from '@/integrations/supabase/client';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  studentId: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  email: string;
  fullName: string;
  role: string;
}

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: data.fullName,
          student_id: data.studentId,
          role: data.role.toLowerCase(),
        }
      }
    });

    if (error) throw error;
    if (!authData.user) throw new Error('Registration failed');

    const response: AuthResponse = {
      token: authData.session?.access_token || '',
      id: authData.user.id,
      email: authData.user.email || '',
      fullName: data.fullName,
      role: data.role,
    };

    localStorage.setItem('user', JSON.stringify(response));
    return response;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    if (!authData.user) throw new Error('Login failed');

    // Fetch profile to get role
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', authData.user.id)
      .maybeSingle();

    const role = profile?.role?.toUpperCase() || 'STUDENT';

    const response: AuthResponse = {
      token: authData.session?.access_token || '',
      id: authData.user.id,
      email: authData.user.email || '',
      fullName: profile?.full_name || '',
      role: role,
    };

    localStorage.setItem('user', JSON.stringify(response));
    return response;
  }

  async logout() {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
  }

  getCurrentUser(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
}

export default new AuthService();
