export interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface AuthState {
  user: any;
  profile: Profile | null;
  isLoading: boolean;
}

export interface AuthResponse {
  user: any;
  profile: Profile;
  session: any;
}