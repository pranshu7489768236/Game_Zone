import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-win',
  template: `
    <div class="d-flex align-items-center justify-content-center" style="min-height:60vh;">
      <div class="text-center text-white">
        <span class="material-icons" style="font-size:64px;">trophy</span>
        <h2 class="mt-2">Win Section Coming Soon</h2>
      </div>
    </div>
  `
})
export class WinPage {}

