# Copilot Instructions for ConnectBees WebPage

## Architecture Overview

This is a **dual-frontend architecture** for Connectbees - an AI-powered WhatsApp community management platform:
- `index.html` - Static landing page with embedded CSS (1285 lines) for main website
- `frontend/` - React SPA for interactive components and forms
- `backend/` - Express.js API server handling form submissions and integrations

### Key Integration Points

**Backend Dependencies & Flow (`backend/server.js`)**:
1. **Google Sheets Integration** - Uses service account auth, writes form submissions to spreadsheet
2. **Email Service** - Hostinger SMTP for confirmation emails 
3. **CORS Configuration** - Allows cross-origin requests from React frontend

**Environment Variables Required**:
```bash
FRONTEND_URL=http://localhost:3000
GOOGLE_SERVICE_ACCOUNT=path/to/service-account.json
SHEET_ID=your_google_sheet_id
MAIL_USER=your_hostinger_email
MAIL_PASS=your_hostinger_password
PORT=3000
```

## Development Workflows

### Start Development Servers
```bash
# Backend (from /backend)
npm install && node server.js

# Frontend (from /frontend) 
npm install && npm start
```

### Key API Endpoint
- `POST /api/joint-beta` - Handles beta signup form with validation, Google Sheets logging, and email confirmation

### Frontend-Backend Communication
React component uses `axios` to communicate with Express server:
```javascript
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';
```

## Project-Specific Patterns

### Form Handling Pattern
The `LandingPage.js` component follows a specific validation and submission flow:
1. Client-side validation for all required fields
2. Server-side email regex validation
3. Dual persistence (Google Sheets + email confirmation)
4. User feedback with loading states and error handling

### CSS Architecture
- Uses CSS custom properties (`:root` variables) for consistent theming
- WhatsApp-inspired color scheme (`--primary: #25D366`)
- Mobile-first responsive design with backdrop blur effects

### Error Handling Conventions
- Frontend: Detailed error states with network vs validation distinction
- Backend: Structured JSON responses with `success` boolean and `message`
- Console logging with emoji prefixes (✅ ❌ 🚀) for easy debugging

## File Organization

**Critical Files to Understand**:
- `backend/server.js` - Complete API logic (147 lines)
- `frontend/src/components/LandingPage.js` - Main React component (525 lines)
- `index.html` - Static landing page with full styling (1285 lines)

**Styling Strategy**: Both static and React versions share identical CSS custom properties and class naming conventions for visual consistency.

## External Service Dependencies

1. **Google Sheets API** - Requires service account JSON file for authentication
2. **Hostinger SMTP** - Email service configuration in server.js transporter
3. **React Create App** - Standard CRA setup with no ejection or custom webpack config