<p align="center" draggable="false"><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719" width="200px" height="auto"/></p>

## <h1 align="center" id="heading"> 👋 Hot Mess Coach — Simple LLM App</h1>

Hot Mess Coach is a Thanksgiving-themed mental health coaching application that provides supportive guidance through an AI-powered chat interface. The application consists of a FastAPI backend that integrates with OpenAI's Chat Completions API and a modern Next.js frontend with a beautiful, responsive chat interface.

### Features

- 🤖 AI-powered mental health coaching using OpenAI GPT-4o-mini
- 💬 Real-time chat interface with message history
- 🎨 Modern, responsive UI built with Next.js and Tailwind CSS
- 🦃 Thanksgiving-themed design with delightful animations
- 🔄 CORS-enabled API for seamless frontend-backend communication
- 🏥 Health check endpoint for monitoring API status

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Backend Prerequisites
- **Python 3.12+** - Required for the FastAPI backend
- **`uv` package manager** (recommended) - Fast Python package installer
  ```bash
  pip install uv
  ```
  OR
- **pip** and **venv** - Standard Python package management

### Frontend Prerequisites
- **Node.js 18+** - Required for Next.js
- **npm** or **pnpm** - Package manager (npm comes with Node.js)

### API Keys
- **OpenAI API Key** - Required for the AI chat functionality
  - Sign up at [OpenAI](https://platform.openai.com/) to get your API key
  - Your key should start with `sk-`

---

## Local Setup Instructions

### Backend Setup

#### Option A: Using `uv` (Recommended)

1. **Navigate to the project root:**
   ```bash
   cd /path/to/aie-challenge-hotmess
   ```

2. **Install dependencies:**
   ```bash
   uv sync
   ```

3. **Set your OpenAI API key:**
   
   Create a `.env` file in the project root:
   ```bash
   echo "OPENAI_API_KEY=sk-your-key-here" > .env
   ```
   
   OR export it as an environment variable:
   ```bash
   export OPENAI_API_KEY="sk-your-key-here"
   ```

4. **Start the development server:**
   ```bash
   uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend will be available at `http://localhost:8000`

#### Option B: Using venv + pip

1. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set your OpenAI API key:**
   
   Create a `.env` file in the project root:
   ```bash
   echo "OPENAI_API_KEY=sk-your-key-here" > .env
   ```
   
   OR export it as an environment variable:
   ```bash
   export OPENAI_API_KEY="sk-your-key-here"
   ```

4. **Start the development server:**
   ```bash
   uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd AIM-hot-mess-coach-frontend/frontend-hot-mess-coach
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # OR
   pnpm install
   ```

3. **Configure the backend URL (optional for local development):**
   
   The frontend automatically detects `localhost` and connects to `http://localhost:8000` when running locally. For production or custom setups, create a `.env.local` file:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # OR
   pnpm dev
   ```

   The frontend will be available at `http://localhost:3000`

### Running Both Services

You'll need to run both the backend and frontend simultaneously:

1. **Terminal 1 - Backend:**
   ```bash
   # From project root
   uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   # From frontend directory
   cd AIM-hot-mess-coach-frontend/frontend-hot-mess-coach
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000` to see the application

---

## Deployment Instructions

### Backend Deployment (Vercel)

The backend is configured for Vercel deployment using the `vercel.json` configuration file.

1. **Install Vercel CLI (if not already installed):**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from project root:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel:**
   - Go to your project settings in Vercel dashboard
   - Navigate to "Environment Variables"
   - Add `OPENAI_API_KEY` with your OpenAI API key value

4. **The backend will be deployed and accessible at:**
   ```
   https://your-project-name.vercel.app
   ```

### Frontend Deployment (Vercel)

1. **Navigate to the frontend directory:**
   ```bash
   cd AIM-hot-mess-coach-frontend/frontend-hot-mess-coach
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel:**
   - Go to your frontend project settings in Vercel dashboard
   - Navigate to "Environment Variables"
   - Add `NEXT_PUBLIC_API_URL` with your backend URL (e.g., `https://your-backend.vercel.app`)
   - **Important:** The URL should NOT include `/api/chat` - the frontend will append that automatically

4. **Redeploy after setting environment variables:**
   ```bash
   vercel --prod
   ```

### Alternative Deployment Options

- **Backend:** Can be deployed to any platform supporting Python/FastAPI (Railway, Render, Fly.io, etc.)
- **Frontend:** Can be deployed to any platform supporting Next.js (Netlify, AWS Amplify, etc.)

**Note:** When deploying separately, ensure CORS is properly configured in the backend to allow requests from your frontend domain.

---

## API Documentation

### Base URL

- **Local:** `http://localhost:8000`
- **Production:** Your deployed backend URL

### Endpoints

#### 1. Health Check

**GET** `/health`

Check if the API is running and if the OpenAI API key is configured.

**Response:**
```json
{
  "status": "healthy",
  "api_key_configured": true
}
```

#### 2. Root Endpoint

**GET** `/`

Returns a simple status message.

**Response:**
```json
{
  "status": "ok",
  "message": "Hot Mess Coach API is running"
}
```

#### 3. Chat Endpoint

**POST** `/api/chat`

Send a message to the AI coach and receive a response.

**Request Body:**
```json
{
  "message": "I'm feeling overwhelmed with Thanksgiving preparations"
}
```

**Response:**
```json
{
  "reply": "I understand that feeling! Let's break this down into manageable steps..."
}
```

**Error Responses:**

- **500 Internal Server Error** - If `OPENAI_API_KEY` is not configured:
  ```json
  {
    "detail": "OPENAI_API_KEY not configured"
  }
  ```

- **500 Internal Server Error** - If there's an error calling OpenAI API:
  ```json
  {
    "detail": "Error calling OpenAI API: [error message]"
  }
```

**GET** `/api/chat`

Returns information about the endpoint (requires POST).

**Response:**
```json
{
  "error": "This endpoint requires a POST request",
  "example": {
    "method": "POST",
    "url": "/api/chat",
    "body": {"message": "hi"}
  }
}
```

### Interactive API Documentation

When running the backend locally, you can access interactive API documentation at:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### CORS Configuration

The API is configured to accept requests from any origin (`allow_origins=["*"]`). For production, consider restricting this to your frontend domain for better security.

---

## Troubleshooting Tips

### Backend Issues

#### Issue: `OPENAI_API_KEY not configured`
**Solution:**
- Ensure you've set the environment variable:
  ```bash
  export OPENAI_API_KEY="sk-your-key-here"
  ```
- Or create a `.env` file in the project root with:
  ```
  OPENAI_API_KEY=sk-your-key-here
  ```
- Verify the key is loaded: `curl http://localhost:8000/health`

#### Issue: `ModuleNotFoundError` or import errors
**Solution:**
- Make sure dependencies are installed:
  ```bash
  uv sync
  # OR
  pip install -r requirements.txt
  ```
- Verify you're using Python 3.12 or higher:
  ```bash
  python3 --version
  ```

#### Issue: Port 8000 already in use
**Solution:**
- Use a different port:
  ```bash
  uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8001
  ```
- Update frontend `.env.local` to point to the new port

#### Issue: CORS errors in browser console
**Solution:**
- Verify CORS middleware is enabled in `api/index.py`
- Check that the backend is running and accessible
- Ensure the frontend is using the correct backend URL

### Frontend Issues

#### Issue: Cannot connect to backend
**Solution:**
- Verify the backend is running on `http://localhost:8000`
- Check browser console for specific error messages
- For production, ensure `NEXT_PUBLIC_API_URL` is set correctly
- Test backend directly: `curl http://localhost:8000/health`

#### Issue: `NEXT_PUBLIC_API_URL` not working
**Solution:**
- Environment variables starting with `NEXT_PUBLIC_` must be set before building
- Restart the dev server after changing environment variables
- For production, set the variable in your deployment platform and redeploy

#### Issue: Build errors or TypeScript errors
**Solution:**
- The project is configured to ignore build errors (`ignoreBuildErrors: true` in `next.config.mjs`)
- Run the linter to see specific issues:
  ```bash
  npm run lint
  ```
- Clear Next.js cache:
  ```bash
  rm -rf .next
  npm run dev
  ```

#### Issue: Dependencies not installing
**Solution:**
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- If using pnpm, ensure it's installed:
  ```bash
  npm install -g pnpm
  pnpm install
  ```

### General Issues

#### Issue: API responses are slow
**Solution:**
- Check your OpenAI API key has sufficient credits
- Verify your internet connection
- The model used is `gpt-4o-mini` which should be relatively fast

#### Issue: Messages not appearing in chat
**Solution:**
- Check browser console for JavaScript errors
- Verify the backend is responding (check Network tab in browser DevTools)
- Ensure the response format matches what the frontend expects

#### Issue: Environment variables not loading
**Solution:**
- For backend: Ensure `.env` file is in the project root (same level as `api/` folder)
- For frontend: Use `.env.local` in the frontend directory
- Restart the development servers after changing environment variables
- Never commit `.env` files to version control

### Getting Help

- Check the browser console (F12) for error messages
- Check backend logs in the terminal running uvicorn
- Verify all prerequisites are installed correctly
- Ensure both backend and frontend are running simultaneously
- Test the backend API directly using `curl` or Postman

---

## Project Structure

```
aie-challenge-hotmess/
├── api/                    # FastAPI backend
│   ├── index.py           # Main API application
│   └── README.md          # Backend-specific documentation
├── AIM-hot-mess-coach-frontend/
│   └── frontend-hot-mess-coach/
│       ├── app/           # Next.js app directory
│       ├── components/    # React components
│       ├── lib/           # Utility functions
│       └── public/        # Static assets
├── pyproject.toml         # Python project configuration
├── requirements.txt       # Python dependencies
├── vercel.json           # Vercel deployment configuration
└── README.md             # This file
```

---

## License

This project is part of the AI Maker Space LLM Dev 101 challenge.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
