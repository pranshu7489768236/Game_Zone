import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <h3 class="text-white mb-3">Welcome</h3>
        <div class="card card-surface overflow-hidden">
          <div id="promoCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="https://via.placeholder.com/1200x300?text=Banner+1" class="d-block w-100" alt="Banner 1">
              </div>
              <div class="carousel-item">
                <img src="https://via.placeholder.com/1200x300?text=Banner+2" class="d-block w-100" alt="Banner 2">
              </div>
              <div class="carousel-item">
                <img src="https://via.placeholder.com/1200x300?text=Banner+3" class="d-block w-100" alt="Banner 3">
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#promoCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#promoCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class HomePage {}

