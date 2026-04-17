# Online Exam System - Frontend

A complete React-based Online Exam System with separate modules for Students and Staff.

## Features

### Authentication Module
- Separate registration and login for Students and Staff
- Role-based access control
- Form validation
- LocalStorage for data persistence

### Student Module
- View available exams
- Take exams with MCQ and subjective questions
- Countdown timer with auto-submit
- Question navigation
- Progress bar
- View detailed results with feedback
- Fullscreen exam mode
- Copy/paste prevention during exam

### Staff Module
- Create exams with multiple question types
- Add MCQ and subjective questions
- View student submissions
- Evaluate exams (auto-grading for MCQ)
- Assign marks for subjective questions
- Provide feedback
- Publish results

### Extra Features
- Dark/Light theme toggle
- Responsive design
- Clean and intuitive UI
- Progress tracking
- Real-time timer

## Installation

1. Navigate to project directory:
```bash
cd online-exam-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open browser and visit: http://localhost:3000

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Navbar.js       # Navigation bar with theme toggle
├── pages/              # Page components
│   ├── Home.js         # Landing page with role selection
│   ├── StudentLogin.js # Student authentication
│   ├── StaffLogin.js   # Staff authentication
│   ├── StudentDashboard.js
│   ├── StaffDashboard.js
│   ├── TakeExam.js     # Exam taking interface
│   ├── ViewResult.js   # Student result view
│   ├── CreateExam.js   # Staff exam creation
│   └── EvaluateExams.js # Staff evaluation interface
├── context/            # React Context
│   └── AuthContext.js  # Authentication & theme state
├── utils/              # Utility functions
│   └── storage.js      # LocalStorage operations
├── styles/             # CSS files
│   ├── App.css
│   ├── Navbar.css
│   ├── Home.css
│   ├── Auth.css
│   ├── Dashboard.css
│   ├── TakeExam.css
│   ├── ViewResult.css
│   ├── CreateExam.css
│   └── EvaluateExams.css
├── App.js              # Main app component with routing
└── index.js            # Entry point
```

## Usage Guide

### For Students:
1. Register/Login as Student
2. View available exams on dashboard
3. Click "Start Exam" to begin
4. Answer questions (navigate using question buttons)
5. Submit exam before timer expires
6. View results once staff evaluates

### For Staff:
1. Register/Login as Staff
2. Click "Create New Exam"
3. Add exam details and questions
4. Click "Evaluate Submissions" to grade exams
5. Assign marks and feedback
6. Submit evaluation to publish results

## Technologies Used

- React.js (Functional Components)
- React Router (Navigation)
- React Context API (State Management)
- LocalStorage (Data Persistence)
- CSS3 (Styling with CSS Variables)
- HTML5

## Key Features Implementation

### Timer with Auto-Submit
- Countdown timer in MM:SS format
- Automatic submission when time expires
- Visual timer display

### Fullscreen Mode
- Automatic fullscreen on exam start
- Exit fullscreen on submission

### Copy/Paste Prevention
- Disabled during exam
- Prevents cheating

### Dark/Light Theme
- Toggle button in navbar
- Persists across sessions
- CSS variables for easy theming

### Progress Tracking
- Visual progress bar
- Question navigation grid
- Answered questions highlighted

## Data Storage

All data is stored in browser's LocalStorage:
- `users`: User accounts (students & staff)
- `exams`: Created exams
- `submissions`: Student exam submissions
- `currentUser`: Logged-in user session
- `theme`: Theme preference

## Browser Compatibility

- Chrome (Recommended)
- Firefox
- Edge
- Safari

## Notes

- This is a frontend-only application
- Data persists in browser LocalStorage
- Clear browser data will reset all information
- For production, integrate with backend API
