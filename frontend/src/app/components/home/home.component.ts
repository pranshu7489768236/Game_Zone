import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, GamePeriod, PredictionRequest } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="home-container">
      <!-- Banner Carousel -->
      <div class="banner-container">
        <div class="banner-slide" [class.active]="currentBanner === 0">
          <div class="banner-content">
            <h2>🎮 Welcome to Color Prediction!</h2>
            <p>Predict the right color and number to win big!</p>
          </div>
        </div>
        <div class="banner-slide" [class.active]="currentBanner === 1">
          <div class="banner-content">
            <h2>💰 Get 2x Rewards!</h2>
            <p>Win double your bet amount!</p>
          </div>
        </div>
        <div class="banner-slide" [class.active]="currentBanner === 2">
          <div class="banner-content">
            <h2>⚡ Fast & Secure!</h2>
            <p>Instant payments, secure gameplay!</p>
          </div>
        </div>
      </div>

      <!-- Balance Card -->
      <div class="balance-card card">
        <div class="balance-header">
          <h3><i class="fas fa-wallet"></i> Your Balance</h3>
          <button class="btn btn-sm btn-primary" (click)="refreshBalance()">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        <div class="balance-amount">
          <h2>₹{{ balance | number:'1.2-2' }}</h2>
        </div>
        <div class="balance-actions">
          <button class="btn btn-primary" (click)="showRecharge = true">
            <i class="fas fa-plus"></i> Recharge
          </button>
          <button class="btn btn-secondary" (click)="showTrend = true">
            <i class="fas fa-chart-line"></i> Trend
          </button>
        </div>
      </div>

      <!-- Game Period Info -->
      <div class="game-period card" *ngIf="currentPeriod">
        <div class="period-header">
          <h4>Period: {{ currentPeriod.periodId }}</h4>
          <div class="countdown">
            <i class="fas fa-clock"></i>
            <span>{{ formatTimeLeft(timeLeft) }}</span>
          </div>
        </div>
      </div>

      <!-- Color Prediction Interface -->
      <div class="prediction-interface card">
        <h4 class="text-center mb-4">Make Your Prediction</h4>
        
        <div class="colors-grid">
          <div class="color-option" 
               [class.selected]="selectedColor === 'GREEN'"
               (click)="selectedColor = 'GREEN'">
            <div class="color-box green"></div>
            <span>GREEN</span>
          </div>
          <div class="color-option"
               [class.selected]="selectedColor === 'VIOLET'"
               (click)="selectedColor = 'VIOLET'">
            <div class="color-box violet"></div>
            <span>VIOLET</span>
          </div>
          <div class="color-option"
               [class.selected]="selectedColor === 'RED'"
               (click)="selectedColor = 'RED'">
            <div class="color-box red"></div>
            <span>RED</span>
          </div>
        </div>

        <div class="numbers-grid">
          <div class="number-btn" 
               *ngFor="let num of numbers"
               [class.selected]="selectedNumber === num"
               (click)="selectedNumber = num">
            {{ num }}
          </div>
        </div>

        <button class="btn btn-primary btn-block mt-4" 
                [disabled]="!canSubmit()"
                (click)="submitPrediction()">
          <i class="fas fa-paper-plane"></i> Submit Prediction
        </button>
      </div>

      <!-- Recent Results -->
      <div class="recent-results card" *ngIf="recentPeriods.length > 0">
        <h4 class="mb-3">Recent Results</h4>
        <div class="results-list">
          <div class="result-item" *ngFor="let period of recentPeriods.slice(0, 5)">
            <span class="period-id">Period: {{ period.periodId }}</span>
            <span class="badge" [ngClass]="getColorClass(period.winningColor)">
              {{ period.winningColor }} - {{ period.winningNumber }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .banner-container {
      position: relative;
      height: 150px;
      margin-bottom: 20px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .banner-slide {
      position: absolute;
      width: 100%;
      height: 100%;
      background: var(--gradient-1);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .banner-slide.active {
      opacity: 1;
    }

    .banner-content {
      text-align: center;
      color: white;
    }

    .banner-content h2 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    .balance-card {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
    }

    .balance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .balance-amount h2 {
      font-size: 36px;
      color: var(--primary-color);
      margin: 10px 0;
    }

    .balance-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .balance-actions .btn {
      flex: 1;
    }

    .game-period {
      background: white;
      padding: 15px;
      margin-bottom: 20px;
    }

    .period-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .countdown {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary-color);
      font-weight: 600;
      font-size: 18px;
    }

    .prediction-interface {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
    }

    .colors-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }

    .color-option {
      text-align: center;
      cursor: pointer;
      padding: 15px;
      border-radius: 15px;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .color-option:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .color-option.selected {
      border-color: var(--primary-color);
      background: rgba(255, 107, 157, 0.1);
    }

    .color-box {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin: 0 auto 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .color-box.green {
      background: var(--success-color);
    }

    .color-box.violet {
      background: var(--accent-color);
    }

    .color-box.red {
      background: var(--danger-color);
    }

    .numbers-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
    }

    .number-btn {
      padding: 15px;
      text-align: center;
      background: #f5f5f5;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .number-btn:hover {
      background: #e0e0e0;
      transform: scale(1.05);
    }

    .number-btn.selected {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .recent-results {
      background: white;
      padding: 20px;
    }

    .results-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 10px;
    }

    .btn-block {
      width: 100%;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentBanner = 0;
  balance = 0;
  currentPeriod: GamePeriod | null = null;
  timeLeft = 0;
  selectedColor: string | null = null;
  selectedNumber: number | null = null;
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  recentPeriods: GamePeriod[] = [];
  showRecharge = false;
  showTrend = false;
  
  private bannerInterval?: Subscription;
  private periodInterval?: Subscription;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadBalance();
    this.loadCurrentPeriod();
    this.loadRecentPeriods();
    
    // Auto-slide banner every 5 seconds
    this.bannerInterval = interval(5000).subscribe(() => {
      this.currentBanner = (this.currentBanner + 1) % 3;
    });

    // Update period countdown every second
    this.periodInterval = interval(1000).subscribe(() => {
      if (this.currentPeriod && !this.currentPeriod.isCompleted) {
        this.timeLeft = Math.max(0, this.timeLeft - 1);
        if (this.timeLeft === 0) {
          this.loadCurrentPeriod();
        }
      }
    });
    
    // Refresh period from server every 10 seconds to sync
    interval(10000).subscribe(() => {
      this.loadCurrentPeriod();
    });
  }

  ngOnDestroy() {
    this.bannerInterval?.unsubscribe();
    this.periodInterval?.unsubscribe();
  }

  async loadBalance() {
    try {
      const profile = await this.apiService.getProfile().toPromise();
      if (profile) {
        this.balance = profile.balance;
      }
    } catch (error) {
      console.error('Failed to load balance', error);
    }
  }

  async loadCurrentPeriod() {
    try {
      const period = await this.apiService.getCurrentPeriod().toPromise();
      if (period) {
        this.currentPeriod = period;
        this.timeLeft = period.timeLeftSeconds;
      }
    } catch (error) {
      console.error('Failed to load current period', error);
    }
  }

  async loadRecentPeriods() {
    try {
      const periods = await this.apiService.getRecentPeriods().toPromise();
      if (periods) {
        this.recentPeriods = periods.filter(p => p.isCompleted);
      }
    } catch (error) {
      console.error('Failed to load recent periods', error);
    }
  }

  formatTimeLeft(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  canSubmit(): boolean {
    return !!this.selectedColor && this.selectedNumber !== null && this.currentPeriod !== null;
  }

  async submitPrediction() {
    if (!this.canSubmit() || !this.currentPeriod) {
      return;
    }

    try {
      const request: PredictionRequest = {
        periodId: this.currentPeriod.periodId,
        color: this.selectedColor!,
        number: this.selectedNumber!
      };

      const response = await this.apiService.submitPrediction(request).toPromise();
      if (response?.success) {
        alert('Prediction submitted successfully!');
        this.selectedColor = null;
        this.selectedNumber = null;
        this.loadBalance();
      } else {
        alert(response?.message || 'Failed to submit prediction');
      }
    } catch (error: any) {
      alert(error?.error?.message || 'Failed to submit prediction');
    }
  }

  refreshBalance() {
    this.loadBalance();
  }

  getColorClass(color: string | null): string {
    if (!color) return '';
    return color.toLowerCase() + '-badge';
  }
}

