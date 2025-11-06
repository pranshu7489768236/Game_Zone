import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

interface ProfileResponse { mobileNumber: string; walletBalance: number; }

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card card-surface p-4">
            <h4 class="text-white mb-3">Profile</h4>
            <div class="text-white" *ngIf="profile; else loading">
              <p class="mb-1"><strong>Mobile:</strong> {{ profile.mobileNumber }}</p>
              <p class="mb-4"><strong>Wallet Balance:</strong> {{ profile.walletBalance | currency:'USD' }}</p>
              <button class="btn btn-danger w-100" (click)="logout()">Logout</button>
            </div>
            <ng-template #loading>
              <p class="text-white">Loading...</p>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfilePage implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private router = inject(Router);
  profile: ProfileResponse | null = null;

  ngOnInit(): void {
    this.http.get<ProfileResponse>('/api/user/me').subscribe(res => this.profile = res);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}

