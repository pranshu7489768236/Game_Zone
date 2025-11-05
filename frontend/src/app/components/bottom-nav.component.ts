import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bottom-nav py-2">
      <ul class="nav justify-content-around">
        <li class="nav-item">
          <a class="nav-link" routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            <span class="material-icons d-block">home</span>
            <small>Home</small>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/register" routerLinkActive="active">
            <span class="material-icons d-block">person_add</span>
            <small>Register</small>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/win" routerLinkActive="active">
            <span class="material-icons d-block">trophy</span>
            <small>Win</small>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/profile" routerLinkActive="active">
            <span class="material-icons d-block">person</span>
            <small>Profile</small>
          </a>
        </li>
      </ul>
    </nav>
  `
})
export class BottomNavComponent {}

