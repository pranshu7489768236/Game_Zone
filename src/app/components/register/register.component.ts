import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card card">
        <div class="card-header">
          <h2><i class="fas fa-user-plus"></i> Register</h2>
          <p>Create your account to start playing</p>
        </div>

        <form (ngSubmit)="onRegister()" #registerForm="ngForm">
          <div class="form-group">
            <label><i class="fas fa-phone"></i> Mobile Number</label>
            <input 
              type="tel" 
              class="form-control" 
              [(ngModel)]="mobileNumber"
              name="mobileNumber"
              placeholder="Enter 10-digit mobile number"
              pattern="[0-9]{10}"
              required
              maxlength="10">
          </div>

          <div class="form-group">
            <label><i class="fas fa-lock"></i> Password</label>
            <input 
              type="password" 
              class="form-control" 
              [(ngModel)]="password"
              name="password"
              placeholder="Enter password (min 6 characters)"
              minlength="6"
              required>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            [disabled]="registerForm.invalid || loading">
            <span *ngIf="!loading">Send OTP</span>
            <span *ngIf="loading">Sending...</span>
          </button>
        </form>

        <div class="alert alert-info mt-3" *ngIf="otpSent">
          <i class="fas fa-info-circle"></i>
          OTP sent to your mobile number. Check console for development mode.
        </div>

        <div class="alert alert-danger mt-3" *ngIf="error">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>

        <div class="mt-3 text-center">
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </div>
      </div>

      <!-- OTP Verification Modal -->
      <div class="modal-overlay" *ngIf="otpSent" (click)="closeOTPModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h3>Verify OTP</h3>
          <p>Enter the OTP sent to {{ mobileNumber }}</p>
          
          <div class="form-group">
            <input 
              type="text" 
              class="form-control text-center" 
              [(ngModel)]="otp"
              placeholder="Enter 6-digit OTP"
              maxlength="6"
              style="font-size: 24px; letter-spacing: 8px;">
          </div>

          <button 
            class="btn btn-primary btn-block"
            (click)="verifyOTP()"
            [disabled]="!otp || otp.length !== 6 || loading">
            Verify OTP
          </button>

          <button 
            class="btn btn-secondary btn-block mt-2"
            (click)="closeOTPModal()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .register-card {
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

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 20px;
      max-width: 400px;
      width: 90%;
      text-align: center;
    }

    .modal-content h3 {
      color: var(--primary-color);
      margin-bottom: 10px;
    }

    .alert {
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 15px;
    }

    .alert-info {
      background: #e3f2fd;
      color: #1976d2;
    }

    .alert-danger {
      background: #ffebee;
      color: #c62828;
    }
  `]
})
export class RegisterComponent {
  mobileNumber = '';
  password = '';
  otp = '';
  otpSent = false;
  loading = false;
  error = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  async onRegister() {
    this.error = '';
    this.loading = true;

    try {
      const response = await this.apiService.register({
        mobileNumber: this.mobileNumber,
        password: this.password
      }).toPromise();

      if (response?.success) {
        this.otpSent = true;
        alert('OTP sent! Check console for development mode OTP.');
      } else {
        this.error = response?.message || 'Registration failed';
      }
    } catch (error: any) {
      this.error = error?.error?.message || 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async verifyOTP() {
    if (!this.otp || this.otp.length !== 6) {
      this.error = 'Please enter a valid 6-digit OTP';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const response = await this.apiService.verifyOTP({
        mobileNumber: this.mobileNumber,
        password: this.password,
        otp: this.otp
      }).toPromise();

      if (response?.success) {
        alert('Account created successfully! Please login.');
        this.router.navigate(['/login']);
      } else {
        this.error = response?.message || 'OTP verification failed';
      }
    } catch (error: any) {
      this.error = error?.error?.message || 'OTP verification failed';
    } finally {
      this.loading = false;
    }
  }

  closeOTPModal() {
    this.otpSent = false;
    this.otp = '';
  }
}

