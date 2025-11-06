import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginRequest { mobileNumber: string; password: string; }
export interface LoginResponse { token: string; }
export interface SendOtpRequest { mobileNumber: string; }
export interface VerifyOtpRequest { mobileNumber: string; otp: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  private authState$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Defer localStorage access to avoid issues during bootstrap
    if (typeof window !== 'undefined' && window.localStorage) {
      this.authState$.next(this.hasToken());
    }
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  sendOtp(data: SendOtpRequest) {
    return this.http.post(`${this.baseUrl}/auth/send-otp`, data);
  }

  verifyOtp(data: VerifyOtpRequest) {
    return this.http.post(`${this.baseUrl}/auth/verify-otp`, data);
  }

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, data).pipe(
      tap(res => {
        localStorage.setItem('jwt', res.token);
        this.authState$.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('jwt');
    this.authState$.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwt');
  }
}

