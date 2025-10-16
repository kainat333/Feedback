# Startup Guide - Frontend & Backend Connection

## Prerequisites
- MongoDB running on localhost:27017 (make sure MongoDB is installed and running)
- Node.js installed

## Starting the Backend

1. Navigate to the backend folder:
   ```bash
   cd feedback-backend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```

   You should see:
   ```
   MongoDB connected
   Server running on http://localhost:5000
   ```

## Starting the Frontend

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd feedback
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

   You should see something like:
   ```
   Local:   http://localhost:5173/
   ```

## Testing the Connection

1. Open your browser and go to `http://localhost:5173`

2. **Test Registration:**
   - Go to the register page
   - Fill out the form with valid data
   - Click "Create Account"
   - You should be redirected to the feedback page

3. **Test Sign In:**
   - Go to the sign in page 
   - Use the credentials you just registered with
   - Click "Sign In"
   - You should be redirected to the feedback page

4. **Test Feedback Submission:**
   - Fill out the feedback form
   - Click "Submit"
   - You should be redirected to a response submitted page

## Common Issues

- **MongoDB Connection Error:** Make sure MongoDB is running locally
- **CORS Error:** Backend should handle CORS for localhost:5173
- **Port Conflicts:** Backend runs on 5000, frontend on 5173
- **Missing Dependencies:** Run `npm install` in both folders

## API Endpoints

- POST `/api/users/register` - User registration
- POST `/api/users/login` - User login  
- POST `/api/feedback/submit` - Submit feedback
- GET `/api/feedback/:userId` - Get user's feedback

The connection should now work properly between frontend and backend!
