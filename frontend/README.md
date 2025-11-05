# Color Prediction Game - Frontend

Angular 17+ frontend for the Color Prediction Game application.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   ng serve
   ```

3. **Open Browser**
   Navigate to `http://localhost:4200`

## 📦 Dependencies

- Angular 17+
- Bootstrap 5
- Font Awesome 6
- RxJS

## 🏗️ Project Structure

```
src/app/
├── components/
│   ├── bottom-nav/      # Bottom navigation bar
│   ├── home/            # Home page with game
│   ├── register/        # Registration with OTP
│   ├── login/           # Login page
│   ├── win/             # Win/prediction page
│   └── profile/         # User profile
├── services/
│   ├── api.service.ts   # API communication
│   └── auth.service.ts  # Authentication service
├── guards/
│   └── auth.guard.ts    # Route protection
├── interceptors/
│   └── auth.interceptor.ts  # JWT token injection
└── app.routes.ts        # Routing configuration
```

## 🎨 Features

- Standalone components (Angular 17+)
- Responsive design
- JWT authentication
- Real-time countdown
- Auto-sliding banners
- Color prediction interface

## 🔧 Configuration

Update API URL in `services/api.service.ts` if backend runs on different port:

```typescript
const API_URL = 'http://localhost:8080/api';
```

## 📱 Responsive Design

- Mobile-first approach
- Bottom navigation for mobile
- Adaptive layouts for tablet/desktop

## 🐛 Troubleshooting

- **Build errors**: Clear `node_modules` and reinstall
- **API errors**: Verify backend is running on port 8080
- **CORS errors**: Check backend CORS configuration

