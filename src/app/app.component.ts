import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from './components/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  template: `
    <div class="page-wrap container py-3">
      <router-outlet></router-outlet>
    </div>
    <app-bottom-nav></app-bottom-nav>
  `
})
export class AppComponent {}
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      position: relative;
    }
  `]
})
export class AppComponent {
  title = 'Color Prediction Game';
}

