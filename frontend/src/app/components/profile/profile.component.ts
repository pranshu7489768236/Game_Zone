import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, UserProfile, PredictionHistory } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-header card">
        <div class="profile-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <h2>{{ userProfile?.mobileNumber || 'User' }}</h2>
        <div class="balance-display">
          <i class="fas fa-wallet"></i>
          <span>₹{{ userProfile?.balance | number:'1.2-2' || '0.00' }}</span>
        </div>
      </div>

      <div class="profile-actions card">
        <button class="action-btn" (click)="showRecharge = true">
          <i class="fas fa-plus-circle"></i>
          <span>Recharge</span>
        </button>
        <button class="action-btn" (click)="loadHistory()">
          <i class="fas fa-history"></i>
          <span>History</span>
        </button>
        <button class="action-btn" (click)="logout()">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>

      <div class="profile-stats card">
        <h4>Statistics</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ totalPredictions }}</div>
            <div class="stat-label">Total Predictions</div>
          </div>
          <div class="stat-item">
            <div class="stat-value win">{{ totalWins }}</div>
            <div class="stat-label">Wins</div>
          </div>
          <div class="stat-item">
            <div class="stat-value loss">{{ totalLosses }}</div>
            <div class="stat-label">Losses</div>
          </div>
        </div>
      </div>

      <div class="recent-activity card" *ngIf="recentHistory.length > 0">
        <h4>Recent Activity</h4>
        <div class="activity-list">
          <div class="activity-item" *ngFor="let item of recentHistory.slice(0, 5)">
            <div class="activity-icon">
              <i class="fas" [ngClass]="getStatusIcon(item.status)"></i>
            </div>
            <div class="activity-details">
              <div class="activity-title">Period {{ item.periodId }}</div>
              <div class="activity-subtitle">
                {{ item.chosenColor }} - {{ item.chosenNumber }}
                <span class="badge" [ngClass]="getStatusClass(item.status)">
                  {{ item.status }}
                </span>
              </div>
            </div>
            <div class="activity-date">
              {{ formatDate(item.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .profile-header {
      background: white;
      padding: 30px;
      text-align: center;
      margin-bottom: 20px;
    }

    .profile-avatar {
      font-size: 80px;
      color: var(--primary-color);
      margin-bottom: 15px;
    }

    .profile-header h2 {
      color: var(--dark);
      margin-bottom: 15px;
    }

    .balance-display {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--gradient-2);
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 20px;
      font-weight: 600;
    }

    .profile-actions {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 15px;
      background: #f5f5f5;
      border: none;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--dark);
    }

    .action-btn:hover {
      background: var(--primary-color);
      color: white;
      transform: translateY(-2px);
    }

    .action-btn i {
      font-size: 24px;
    }

    .profile-stats {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 15px;
    }

    .stat-item {
      text-align: center;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 10px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 5px;
    }

    .stat-value.win {
      color: var(--success-color);
    }

    .stat-value.loss {
      color: var(--danger-color);
    }

    .stat-label {
      font-size: 12px;
      color: #666;
    }

    .recent-activity {
      background: white;
      padding: 20px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 15px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 10px;
    }

    .activity-icon {
      font-size: 24px;
      color: var(--primary-color);
    }

    .activity-details {
      flex: 1;
    }

    .activity-title {
      font-weight: 600;
      margin-bottom: 5px;
    }

    .activity-subtitle {
      font-size: 14px;
      color: #666;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .activity-date {
      font-size: 12px;
      color: #999;
    }
  `]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  recentHistory: PredictionHistory[] = [];
  showRecharge = false;
  
  get totalPredictions(): number {
    return this.recentHistory.length;
  }
  
  get totalWins(): number {
    return this.recentHistory.filter(h => h.status === 'WIN').length;
  }
  
  get totalLosses(): number {
    return this.recentHistory.filter(h => h.status === 'LOSS').length;
  }

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadProfile();
    await this.loadHistory();
  }

  async loadProfile() {
    try {
      const profile = await this.apiService.getProfile().toPromise();
      if (profile) {
        this.userProfile = profile;
      }
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  }

  async loadHistory() {
    try {
      const history = await this.apiService.getHistory().toPromise();
      if (history) {
        this.recentHistory = history;
      }
    } catch (error) {
      console.error('Failed to load history', error);
    }
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  getStatusIcon(status: string): string {
    if (status === 'WIN') return 'fa-check-circle';
    if (status === 'LOSS') return 'fa-times-circle';
    return 'fa-clock';
  }

  getStatusClass(status: string): string {
    return status.toUpperCase();
  }
}

