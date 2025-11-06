import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { jwtInterceptor } from './app/core/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
}).catch(err => console.error(err));
