import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
  <div class="d-flex align-items-center justify-content-center" style="min-height: 70vh;">
    <div class="card card-surface w-100" style="max-width:420px;">
      <div class="card-body p-4">
        <h4 class="text-center mb-3 text-white">Create Account</h4>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label text-white">Mobile Number</label>
            <div class="input-group">
              <span class="input-group-text"><span class="material-icons">phone_iphone</span></span>
              <input type="tel" class="form-control" formControlName="mobileNumber" maxlength="10" placeholder="Enter 10-digit number" />
            </div>
            <div class="form-text text-warning" *ngIf="mobileInvalid">Enter a valid 10-digit mobile number.</div>
          </div>

          <div class="mb-3" *ngIf="otpSent">
            <label class="form-label text-white">OTP</label>
            <div class="input-group">
              <span class="input-group-text"><span class="material-icons">vpn_key</span></span>
              <input type="text" class="form-control" formControlName="otp" maxlength="6" placeholder="Enter 6-digit OTP" />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label text-white">Password</label>
            <div class="input-group">
              <span class="input-group-text"><span class="material-icons">lock</span></span>
              <input type="password" class="form-control" formControlName="password" placeholder="Min 6 characters" />
            </div>
            <div class="form-text text-warning" *ngIf="passwordInvalid">Minimum 6 characters required.</div>
          </div>

          <button type="button" class="btn gradient-btn w-100 py-2" (click)="onSendOtp()" [disabled]="!canSendOtp" *ngIf="!otpSent">Send OTP</button>
          <button type="submit" class="btn gradient-btn w-100 py-2" [disabled]="!canSubmit" *ngIf="otpSent">Submit</button>

          <div class="mt-3 text-center">
            <a routerLink="/login" class="link-light">Already have an account? Login</a>
          </div>
          <div class="mt-2 text-center">
            <small class="text-danger" *ngIf="error">{{ error }}</small>
            <small class="text-success" *ngIf="success">{{ success }}</small>
          </div>
        </form>
      </div>
    </div>
  </div>
  `
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  otpSent = false;
  error = '';
  success = '';

  form = this.fb.group({
    mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    otp: ['']
  });

  get canSendOtp() {
    return this.form.controls.mobileNumber.valid;
  }

  get mobileInvalid() {
    const c = this.form.controls.mobileNumber;
    return c.touched && c.invalid;
  }

  get passwordInvalid() {
    const c = this.form.controls.password;
    return c.touched && c.invalid;
  }

  get canSubmit() {
    const otpOk = /^\d{6}$/.test(this.form.value.otp || '');
    const pwdOk = this.form.controls.password.valid;
    return this.otpSent && otpOk && pwdOk;
  }

  onSendOtp() {
    this.error = '';
    if (!this.canSendOtp) return;
    this.auth.sendOtp({ mobileNumber: this.form.value.mobileNumber! }).subscribe({
      next: () => {
        this.otpSent = true;
        this.success = 'OTP sent successfully';
      },
      error: (e) => {
        this.error = e?.error?.message || 'Failed to send OTP';
      }
    });
  }

  onSubmit() {
    this.error = '';
    if (!this.canSubmit) return;
    this.auth.verifyOtp({
      mobileNumber: this.form.value.mobileNumber!,
      otp: this.form.value.otp!,
      password: this.form.value.password!
    }).subscribe({
      next: () => {
        this.success = 'Registration successful. Redirecting to login...';
        setTimeout(() => this.router.navigateByUrl('/login'), 800);
      },
      error: (e) => this.error = e?.error?.message || 'Invalid or expired OTP'
    });
  }
}

