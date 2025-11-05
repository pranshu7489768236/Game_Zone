import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card card">
        <div class="card-header">
          <h2><i class="fas fa-sign-in-alt"></i> Login</h2>
          <p>Welcome back! Please login to continue</p>
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label><i class="fas fa-phone"></i> Mobile Number</label>
            <input 
              type="tel" 
              class="form-control" 
              [(ngModel)]="mobileNumber"
              name="mobileNumber"
              placeholder="Enter your mobile number"
              required>
          </div>

          <div class="form-group">
            <label><i class="fas fa-lock"></i> Password</label>
            <input 
              type="password" 
              class="form-control" 
              [(ngModel)]="password"
              name="password"
              placeholder="Enter your password"
              required>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            [disabled]="loginForm.invalid || loading">
            <span *ngIf="!loading">Login</span>
            <span *ngIf="loading">Logging in...</span>
          </button>
        </form>

        <div class="alert alert-danger mt-3" *ngIf="error">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>

        <div class="mt-3 text-center">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .login-card {
      background: white;
      padding: 30px;
      max-width: 400px;
      width: 100%;
    }

    .card-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .card-header h2 {
      color: var(--primary-color);
      margin-bottom: 10px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--dark);
    }

    .form-group label i {
      margin-right: 8px;
      color: var(--primary-color);
    }

    .btn-block {
      width: 100%;
      margin-top: 10px;
    }

    .alert-danger {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 10px;
    }
  `]
})
export class LoginComponent {
  mobileNumber = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    this.error = '';
    this.loading = true;

    try {
      const response = await this.apiService.login({
        mobileNumber: this.mobileNumber,
        password: this.password
      }).toPromise();

      if (response?.success && response.token) {
        this.authService.setToken(response.token);
        await this.authService.loadUserProfile();
        this.router.navigate(['/home']);
      } else {
        this.error = response?.message || 'Login failed';
      }
    } catch (error: any) {
      this.error = error?.error?.message || 'Login failed. Please check your credentials.';
    } finally {
      this.loading = false;
    }
  }
}

