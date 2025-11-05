import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api';

export interface RegisterRequest {
  mobileNumber: string;
  password: string;
}

export interface VerifyOTPRequest {
  mobileNumber: string;
  password: string;
  otp: string;
}

export interface LoginRequest {
  mobileNumber: string;
  password: string;
}

export interface AuthResponse {
  token: string | null;
  message: string;
  success: boolean;
}

export interface UserProfile {
  id: number;
  mobileNumber: string;
  balance: number;
}

export interface GamePeriod {
  periodId: string;
  timeLeftSeconds: number;
  winningColor: string | null;
  winningNumber: number | null;
  isCompleted: boolean;
}

export interface PredictionRequest {
  periodId: string;
  color: string;
  number: number;
}

export interface PredictionHistory {
  id: number;
  periodId: string;
  chosenColor: string;
  chosenNumber: number;
  status: string;
  createdAt: string;
  winningColor: string | null;
  winningNumber: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, request);
  }

  verifyOTP(request: VerifyOTPRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/verify-otp`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, request);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_URL}/user/profile`);
  }

  getCurrentPeriod(): Observable<GamePeriod> {
    return this.http.get<GamePeriod>(`${API_URL}/game/period`);
  }

  submitPrediction(request: PredictionRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/game/submit`, request);
  }

  getHistory(): Observable<PredictionHistory[]> {
    return this.http.get<PredictionHistory[]>(`${API_URL}/game/history`);
  }

  getRecentPeriods(): Observable<GamePeriod[]> {
    return this.http.get<GamePeriod[]>(`${API_URL}/game/recent-periods`);
  }
}

