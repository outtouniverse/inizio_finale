# MERN Stack Backend API

A comprehensive backend API for MERN stack applications with JWT authentication, Google OAuth, email verification, and security features.

## 🚀 Features

- **JWT Authentication** with access/refresh tokens in HTTP-only cookies
- **Google OAuth 2.0** integration
- **Email Verification** and password reset
- **Role-based Access Control** (User/Admin)
- **Rate Limiting** and security middleware
- **Session Management** with device tracking
- **MongoDB** with Mongoose ODM
- **Input Validation** and sanitization
- **Error Handling** with detailed responses
- **CORS** and security headers

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Gmail account (for email service)

## 🛠️ Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp env-example.txt .env
   ```

   Or create `.env` file manually with these variables:
   ```env
   # Environment Configuration
   NODE_ENV=development
   PORT=5000

   # Database
   MONGODB_URI=mongodb://localhost:27017/mernapp

   # JWT Secrets (Generate strong random strings for production)
   JWT_ACCESS_SECRET=your_access_token_secret_here_generate_a_long_random_string
   JWT_REFRESH_SECRET=your_refresh_token_secret_here_generate_a_long_random_string

   # Google OAuth (Get these from Google Cloud Console)
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

   # Frontend URL
   CLIENT_URL=http://localhost:3000

   # Email Service (For Gmail, use app password)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password

   # Security
   BCRYPT_ROUNDS=12
   JWT_ACCESS_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   EMAIL_VERIFY_EXPIRE=24h
   PASSWORD_RESET_EXPIRE=1h
   ```

4. **Configure environment variables in `.env`:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mernapp
   JWT_ACCESS_SECRET=your_super_secret_access_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
   CLIENT_URL=http://localhost:3000
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   ```

5. **Start MongoDB** (if running locally)

6. **Start the server:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 🔧 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/v1/auth/google/callback`
6. Update `.env` with your client ID and secret

## 📧 Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Use the App Password (not your regular password) in the `.env` file

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### POST `/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "emailVerified": false
    }
  }
}
```

#### POST `/auth/login`
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "identifier": "john@example.com", // or username
  "password": "SecurePass123"
}
```

#### GET `/auth/google`
Initiate Google OAuth login.

#### GET `/auth/google/callback`
Google OAuth callback (handled automatically).

#### POST `/auth/logout`
Logout user and revoke tokens.

#### POST `/auth/refresh-token`
Refresh access token using refresh token.

#### POST `/auth/verify-email`
Verify email address with token.

#### POST `/auth/forgot-password`
Send password reset email.

#### POST `/auth/reset-password`
Reset password with token.

### User Management Endpoints

#### GET `/users/profile`
Get current user profile.

#### PUT `/users/profile`
Update user profile.

#### PUT `/users/change-password`
Change user password.

#### DELETE `/users/account`
Delete user account (soft delete).

### Session Management Endpoints

#### GET `/sessions`
Get all active sessions for current user.

#### DELETE `/sessions/:id`
Revoke a specific session.

#### DELETE `/sessions/all`
Revoke all user sessions.

#### GET `/sessions/current`
Get current session information.

### Health Check

#### GET `/health`
Check API and database health.

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing control
- **Rate Limiting**: Prevents abuse (5 auth requests per 15min)
- **MongoDB Sanitization**: Prevents NoSQL injection
- **Input Validation**: Comprehensive validation with express-validator
- **JWT**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Track and revoke user sessions

## 📁 Project Structure

```
backend/
├── bin/
│   └── www                 # Server startup script
├── config/
│   ├── database.js         # MongoDB connection
│   └── passport.js         # Google OAuth config
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── roleCheck.js       # Role-based access control
│   ├── validation.js      # Input validation
│   ├── rateLimiter.js     # Rate limiting
│   └── errorHandler.js    # Global error handling
├── models/
│   ├── User.js            # User schema
│   └── Session.js         # Session schema
├── routes/
│   ├── index.js           # Health check
│   ├── auth.js            # Authentication routes
│   ├── users.js           # User management
│   └── sessions.js        # Session management
├── utils/
│   ├── tokenUtils.js      # JWT token utilities
│   └── emailService.js    # Email sending service
├── views/                 # EJS templates
├── public/                # Static files
├── app.js                 # Express app configuration
├── package.json
├── env-example.txt        # Environment variables template
└── README.md
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

1. Set `NODE_ENV=production` in environment
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Configure SSL/TLS certificates
5. Set up MongoDB replica set for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please create an issue in the repository.
