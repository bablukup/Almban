# Āḷmban Backend

This is a **Node.js + Express.js + MongoDB** backend for an AI-powered chatbot.  
It provides authentication, user management, messaging, analytics, and AI response handling.

---

## 📂 Project Structure

```
├── controllers/        # Route controllers (auth, messages, etc.)
├── middleware/         # Middlewares (auth, error handling, logging)
├── models/             # MongoDB Mongoose models
│   ├── User.js
│   ├── Message.js
│   └── Analytics.js
├── routes/             # Express routes
│   ├── authRoutes.js
│   ├── messageRoutes.js
│   └── userRoutes.js
├── utils/              # Utility functions
│   ├── aiResponse.js
│   ├── contextManager.js
│   ├── emotionAnalyzer.js
│   ├── logger.js
│   └── sanitizer.js
├── db.js               # MongoDB connection
├── server.js           # Entry point
├── .env                # Environment variables
├── .gitignore
├── package.json
└── package-lock.json
```

---

## ⚙️ Installation

1. Clone the repository

   ```bash
   git clone https://github.com/bablukup/Almban
   cd ai-chatbot-backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the server
   ```bash
   npm run dev   # for development (with nodemon)
   npm start     # for production
   ```

---

## 🔑 Authentication

- JWT-based authentication
- Signup & Login APIs
- Middleware (`authMiddleware.js`) to protect private routes

---

## 📡 API Endpoints

### Auth Routes (`/api/auth`)

- `POST /signup` → Register new user
- `POST /login` → Login user

### User Routes (`/api/users`)

- `GET /me` → Get logged-in user profile
- `PUT /preferences` → Update language/tone preferences
- `DELETE /delete` → Delete account

### Message Routes (`/api/messages`)

- `POST /send` → Send a message (text, voice, image, code, etc.)
- `GET /history` → Get chat history

### Analytics Routes (`/api/analytics`)

- Tracks:
  - `message_created`
  - `feedback_submitted`
  - `session_started / session_ended`
  - `user_login / user_logout`
  - `preference_updated`
  - `error_occurred`

---

## 🛠️ Utilities

- **aiResponse.js** → Handles AI responses from OpenAI
- **contextManager.js** → Maintains conversation context
- **emotionAnalyzer.js** → Detects emotional tone of messages
- **logger.js** → Centralized logging
- **sanitizer.js** → Cleans user inputs

---

## 📊 Analytics

The system tracks user activity and system performance using the `Analytics` model.

- Get user activity over a date range
- Track system metrics (events per day, unique users, etc.)

---

## 🚀 Future Improvements

- Add voice-to-text + text-to-speech integration
- Improve AI personalization using user preferences
- Advanced analytics dashboard (charts & insights)
- Caching layer for faster message history retrieval
