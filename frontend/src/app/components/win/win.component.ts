import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, GamePeriod, PredictionRequest, PredictionHistory } from '../../services/api.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-win',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="win-container">
      <div class="win-header card">
        <h2><i class="fas fa-trophy"></i> Color Prediction</h2>
        <div class="period-info" *ngIf="currentPeriod">
          <div class="period-id">Period: {{ currentPeriod.periodId }}</div>
          <div class="countdown">
            <i class="fas fa-clock"></i>
            <span>{{ formatTimeLeft(timeLeft) }}</span>
          </div>
        </div>
      </div>

      <!-- Color Selection -->
      <div class="color-selection card">
        <h4 class="mb-3">Select Color</h4>
        <div class="colors-row">
          <div class="color-card" 
               [class.selected]="selectedColor === 'GREEN'"
               (click)="selectedColor = 'GREEN'">
            <div class="color-circle green"></div>
            <span>GREEN</span>
          </div>
          <div class="color-card"
               [class.selected]="selectedColor === 'VIOLET'"
               (click)="selectedColor = 'VIOLET'">
            <div class="color-circle violet"></div>
            <span>VIOLET</span>
          </div>
          <div class="color-card"
               [class.selected]="selectedColor === 'RED'"
               (click)="selectedColor = 'RED'">
            <div class="color-circle red"></div>
            <span>RED</span>
          </div>
        </div>
      </div>

      <!-- Number Selection -->
      <div class="number-selection card">
        <h4 class="mb-3">Select Number (0-9)</h4>
        <div class="numbers-row">
          <div class="number-card" 
               *ngFor="let num of numbers"
               [class.selected]="selectedNumber === num"
               (click)="selectedNumber = num">
            {{ num }}
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button class="btn btn-primary btn-block btn-lg" 
              [disabled]="!canSubmit()"
              (click)="submitPrediction()">
        <i class="fas fa-paper-plane"></i> Submit Prediction
      </button>

      <!-- Prediction History -->
      <div class="history-section card">
        <h4 class="mb-3"><i class="fas fa-history"></i> Your Prediction History</h4>
        <div class="history-list">
          <div class="history-item" *ngFor="let item of history">
            <div class="history-period">
              <strong>Period: {{ item.periodId }}</strong>
            </div>
            <div class="history-details">
              <span class="prediction">
                Your: <span class="badge" [ngClass]="getColorClass(item.chosenColor)">
                  {{ item.chosenColor }} - {{ item.chosenNumber }}
                </span>
              </span>
              <span class="result" *ngIf="item.winningColor">
                Result: <span class="badge" [ngClass]="getColorClass(item.winningColor)">
                  {{ item.winningColor }} - {{ item.winningNumber }}
                </span>
              </span>
              <span class="status-badge" [ngClass]="getStatusClass(item.status)">
                {{ item.status }}
              </span>
            </div>
            <div class="history-date">
              {{ formatDate(item.createdAt) }}
            </div>
          </div>
          <div class="no-history" *ngIf="history.length === 0">
            <p>No prediction history yet. Make your first prediction!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .win-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .win-header {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      text-align: center;
    }

    .win-header h2 {
      color: var(--primary-color);
      margin-bottom: 15px;
    }

    .period-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }

    .period-id {
      font-weight: 600;
      color: var(--dark);
    }

    .countdown {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary-color);
      font-weight: 600;
      font-size: 18px;
    }

    .color-selection, .number-selection {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
    }

    .colors-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .color-card {
      text-align: center;
      padding: 20px;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .color-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .color-card.selected {
      border-color: var(--primary-color);
      background: rgba(255, 107, 157, 0.1);
    }

    .color-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .color-circle.green {
      background: var(--success-color);
    }

    .color-circle.violet {
      background: var(--accent-color);
    }

    .color-circle.red {
      background: var(--danger-color);
    }

    .numbers-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
    }

    .number-card {
      padding: 20px;
      text-align: center;
      background: #f5f5f5;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      font-size: 18px;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .number-card:hover {
      background: #e0e0e0;
      transform: scale(1.05);
    }

    .number-card.selected {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .btn-lg {
      padding: 15px;
      font-size: 18px;
      margin-bottom: 20px;
    }

    .history-section {
      background: white;
      padding: 20px;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .history-item {
      padding: 15px;
      background: #f5f5f5;
      border-radius: 10px;
      border-left: 4px solid var(--primary-color);
    }

    .history-details {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 10px 0;
      align-items: center;
    }

    .status-badge {
      padding: 5px 12px;
      border-radius: 15px;
      font-weight: 600;
      font-size: 12px;
    }

    .status-badge.WIN {
      background: var(--success-color);
      color: white;
    }

    .status-badge.LOSS {
      background: var(--danger-color);
      color: white;
    }

    .status-badge.PENDING {
      background: var(--warning-color);
      color: white;
    }

    .history-date {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }

    .no-history {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
})
export class WinComponent implements OnInit, OnDestroy {
  currentPeriod: GamePeriod | null = null;
  timeLeft = 0;
  selectedColor: string | null = null;
  selectedNumber: number | null = null;
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  history: PredictionHistory[] = [];
  
  private periodInterval?: Subscription;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCurrentPeriod();
    this.loadHistory();
    
    this.periodInterval = interval(1000).subscribe(() => {
      if (this.currentPeriod) {
        this.timeLeft = Math.max(0, this.currentPeriod.timeLeftSeconds - 1);
        if (this.timeLeft === 0) {
          this.loadCurrentPeriod();
        }
      }
    });
  }

  ngOnDestroy() {
    this.periodInterval?.unsubscribe();
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

  async loadHistory() {
    try {
      const history = await this.apiService.getHistory().toPromise();
      if (history) {
        this.history = history;
      }
    } catch (error) {
      console.error('Failed to load history', error);
    }
  }

  formatTimeLeft(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
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
        this.loadHistory();
      } else {
        alert(response?.message || 'Failed to submit prediction');
      }
    } catch (error: any) {
      alert(error?.error?.message || 'Failed to submit prediction');
    }
  }

  getColorClass(color: string | null): string {
    if (!color) return '';
    return color.toLowerCase() + '-badge';
  }

  getStatusClass(status: string): string {
    return status.toUpperCase();
  }
}

