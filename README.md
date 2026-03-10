# Shadow Pages - ITYUKTA 2K26 Technical Event

## 🔐 Login Flow System

### How to Test the Login System:

1. **First Visit**: Open `login2.html` in your browser
2. **Login Credentials**: Enter any username and password (minimum 3 characters each)
3. **Successful Login**: You'll be redirected to the home page with a welcome message
4. **Logout**: Click the "Logout" button in the navigation to return to login page

### 🎯 Authentication Flow:

```
login2.html (Entry Point) → Authentication → index.html (Home Page) → Challenge Levels
```

### 🚀 Key Features:

- **Secure Authentication**: Users must login before accessing any content
- **Session Persistence**: Users stay logged in until they logout
- **Real-time Leaderboard**: Automatically updates when users complete/fail levels
- **Welcome Message**: Shows logged-in user's name on home page
- **Logout Functionality**: Clears all session data and redirects to login

### 📊 Leaderboard Database:

The system includes a comprehensive leaderboard database that:
- Tracks user progress in real-time
- Updates automatically when users win/lose levels
- Sorts participants by completion status and time
- Persists data across browser sessions

### 🧪 Testing the System:

1. **Login Test**: Try logging in with different usernames
2. **Leaderboard Test**: Run `testLeaderboardUpdate()` in browser console
3. **Authentication Test**: Try accessing `index.html` directly (should redirect to login)
4. **Logout Test**: Click logout and verify session is cleared

### 🔧 Technical Implementation:

- **Frontend Authentication**: localStorage-based session management
- **Real-time Updates**: Observer pattern for leaderboard synchronization
- **Responsive Design**: Works on all devices
- **Cyberpunk Theme**: Consistent visual design throughout

### 📁 File Structure:

- `login2.html` - Login page (entry point)
- `index.html` - Home page (protected)
- `leaderboard-fix.js` - Database system for leaderboard
- `script.js` - Main application logic
- `styles.css` - Styling and animations
- `start.html` - Optional redirect page

### 🎮 Challenge Flow:

1. User logs in via `login2.html`
2. Redirected to `index.html` with welcome message
3. Clicks "ENTER THE CHALLENGE" to start
4. System initializes user in leaderboard
5. Redirects to `level1.html` to begin challenges
6. Leaderboard updates automatically as user progresses

The system is now fully functional and ready for your ITYUKTA 2K26 technical event!