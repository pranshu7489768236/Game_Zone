# Backend - Spring Boot 3 + PostgreSQL + JWT + Twilio (dev stub)

## Run

- Java 17, Maven
- Create PostgreSQL database `color_prediction`
- Update `src/main/resources/application.yml` datasource and `app.jwt.secret` (Base64 string)
- mvn spring-boot:run

## API

- POST `/api/auth/send-otp` { mobileNumber }
- POST `/api/auth/verify-otp` { mobileNumber, otp, password }
- POST `/api/auth/login` { mobileNumber, password } -> { token }
- GET `/api/user/me` (Bearer token) -> { mobileNumber, walletBalance }

## Notes
- Twilio disabled by default; set `app.twilio.enabled=true` and credentials to send real SMS.
- Public APIs: `/api/auth/**`; Protected: `/api/user/**`, `/api/game/**` (reserved).
# Color Prediction Game - Backend

Spring Boot backend for the Color Prediction Game application.

## 🚀 Quick Start

1. **Setup Database**
   ```sql
   CREATE DATABASE color_prediction_db;
   ```

2. **Configure `application.properties`**
   - Update PostgreSQL connection details
   - Configure JWT secret (for production, use a strong secret)
   - Set Twilio credentials (optional)

3. **Run Application**
   ```bash
   mvn spring-boot:run
   ```

## 📦 Dependencies

- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- PostgreSQL Driver
- JWT (jjwt)
- Twilio SDK
- Lombok

## 🔧 Configuration

Key configuration in `application.properties`:

- Database: PostgreSQL connection
- JWT: Secret and expiration time
- Twilio: Account SID, Auth Token, Phone Number
- CORS: Allowed origins

## 📡 API Endpoints

See main README.md for complete API documentation.

## 🔐 Security

- JWT authentication
- BCrypt password encryption
- Protected endpoints (except auth endpoints)
- CORS enabled for frontend

## 🧪 Testing

```bash
mvn test
```

## 📝 Notes

- OTP service logs to console in development mode
- Game periods auto-complete every 3 minutes
- New users get ₹1000 initial balance

