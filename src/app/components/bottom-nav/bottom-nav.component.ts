import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bottom-nav">
      <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">
        <span class="material-icons">home</span>
        <span>Home</span>
      </a>
      <a routerLink="/register" routerLinkActive="active" *ngIf="!isAuthenticated()">
        <span class="material-icons">person_add</span>
        <span>Register</span>
      </a>
      <a routerLink="/win" routerLinkActive="active" *ngIf="isAuthenticated()">
        <span class="material-icons">emoji_events</span>
        <span>Win</span>
      </a>
      <a routerLink="/profile" routerLinkActive="active" *ngIf="isAuthenticated()">
        <span class="material-icons">person</span>
        <span>Profile</span>
      </a>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 0;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .bottom-nav a {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: #666;
      padding: 8px 20px;
      border-radius: 15px;
      transition: all 0.3s ease;
      font-size: 12px;
    }

    .bottom-nav a .material-icons {
      font-size: 22px;
      margin-bottom: 4px;
    }

    .bottom-nav a.active {
      color: var(--primary-color);
      background: rgba(255, 107, 157, 0.1);
    }

    .bottom-nav a:hover {
      color: var(--primary-color);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .bottom-nav a {
        padding: 8px 15px;
        font-size: 11px;
      }

      .bottom-nav a i {
        font-size: 18px;
      }
    }
  `]
})
export class BottomNavComponent {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

