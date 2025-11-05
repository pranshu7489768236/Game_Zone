import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="d-flex align-items-center justify-content-center" style="min-height: 70vh;">
    <div class="card card-surface w-100" style="max-width:420px;">
      <div class="card-body p-4">
        <h4 class="text-center mb-3 text-white">Login</h4>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label text-white">Mobile Number</label>
            <div class="input-group">
              <span class="input-group-text"><span class="material-icons">phone_iphone</span></span>
              <input type="tel" class="form-control" formControlName="mobileNumber" maxlength="10" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Password</label>
            <div class="input-group">
              <span class="input-group-text"><span class="material-icons">lock</span></span>
              <input type="password" class="form-control" formControlName="password" />
            </div>
          </div>
          <button type="submit" class="btn gradient-btn w-100 py-2" [disabled]="form.invalid">Login</button>
          <div class="mt-2 text-center">
            <small class="text-danger" *ngIf="error">{{ error }}</small>
          </div>
        </form>
      </div>
    </div>
  </div>
  `
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = '';

  form = this.fb.group({
    mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.auth.login({
      mobileNumber: this.form.value.mobileNumber!,
      password: this.form.value.password!
    }).subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: () => this.error = 'Invalid credentials'
    });
  }
}

