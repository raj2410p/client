# AI Journal – Full Stack Assignment

An AI-powered journaling application that allows users to write journal entries and analyze them using a Large Language Model (Gemini).  
The system extracts emotional tone, keywords, and summaries, and generates insights about the user's journaling patterns.

---

## 🚀 Live Demo


🌐 [Deployed on Heroku](https://journal-ai-app-b6ebc2a7736d.herokuapp.com/)  

## Features

- Create journal entries
- Analyze journal text using an LLM (Gemini API)
- Extract emotion, keywords, and summary
- Store analysis results in database
- Cache LLM responses to avoid repeated API calls
- Generate user insights
- Full REST API backend
- React frontend interface
- Automated backend tests with Jest + Supertest

---

## Tech Stack

### Backend
- Node.js
- Express
- SQLite (`better-sqlite3`)
- Gemini API (`@google/genai`)
- Jest
- Supertest

### Frontend
- React
- Axios

### Database
- SQLite

---

## Project Structure
fullStackAssignment
│
├── backend
│ └── src
│ ├── controllers
│ │ └── journalController.js
│ ├── routes
│ │ └── journalRoutes.js
│ ├── services
│ │ └── geminiServices.js
│ ├── db
│ │ └── database.js
│ ├── test
│ │ └── journal.test.js
│ ├── app.js
│ └── server.js
│
├── client
│ └── src
│ ├── App.js
│ └── components
│
├── README.md
└── ARCHITECTURE.md


---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <repo-url>
cd fullStackAssignment
Backend Setup

Navigate to backend folder:

cd backend/src

Install dependencies:

npm install

Create .env file:

GEMINI_API_KEY=your_api_key_here

Start backend:

npm run dev

Backend runs at:

http://localhost:5000
Frontend Setup

Open a new terminal and navigate to client:

cd client
npm install
npm start

Frontend runs at:

http://localhost:3000
API Endpoints
Create Journal Entry
POST /api/journal

Body:

{
  "userId": "user1",
  "ambience": "rain",
  "text": "Today I felt calm listening to the rain."
}
Get Entries
GET /api/journal/:userId

Example:

GET /api/journal/user1
Analyze Entry
POST /api/journal/analyze

Body:

{
  "journalId": 1
}

Response:

{
  "journalId": 1,
  "emotion": "calm",
  "keywords": ["calm","rain","listening"],
  "summary": "The author felt calm listening to the rain.",
  "cached": false
}
Get Insights
GET /api/journal/insights/:userId

Response:

{
  "totalEntries": 1,
  "topEmotion": "calm",
  "mostUsedAmbience": "rain",
  "recentKeywords": ["calm","rain","listening"]
}
Testing

Run backend tests:

npm test

Tests use:

Jest

Supertest

They validate:

API functionality

Validation rules

Journal creation

Insights aggregation

Demo Flow

Create a journal entry

Load entries

Click analyze

View emotional insights

Load insights dashboard

Environment Variables
GEMINI_API_KEY=your_api_key
Future Improvements

User authentication

Real-time analysis

Vector search for journals

Emotion trend visualization

Multi-user support

Cloud deployment
