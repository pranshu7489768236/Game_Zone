import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'user_profile';
  private userSubject = new BehaviorSubject<any>(null);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async loadUserProfile(): Promise<void> {
    if (!this.isAuthenticated()) {
      return;
    }

    try {
      const profile = await this.apiService.getProfile().toPromise();
      if (profile) {
        localStorage.setItem(this.userKey, JSON.stringify(profile));
        this.userSubject.next(profile);
      }
    } catch (error) {
      console.error('Failed to load user profile', error);
      this.logout();
    }
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      this.userSubject.next(JSON.parse(userStr));
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  async refreshUserProfile(): Promise<void> {
    await this.loadUserProfile();
  }
}

