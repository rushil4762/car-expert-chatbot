## Folder Structure

```
car_expert_chatbot/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── apiClient.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── .gitignore
└── README.md
```


## Car Expert Chatbot Backend

This project contains a simple FastAPI backend for the Car Expert Chatbot.
It is designed to answer only car-related questions and keeps the codebase
beginner-friendly for learning and mentoring.


### Backend Setup

The backend lives in:

`14. ai-ml/gen-ai/car_expert_chatbot/backend`

Setup steps:

1. Open a terminal in the backend folder.
2. Create and activate a virtual environment.
3. Install dependencies.
4. Copy `.env.example` to `.env`.
5. Add your NVIDIA API key in `.env`.
6. Start the FastAPI server with Uvicorn.

Example commands:

```bash
cd "/home/rushil/rushil-ranpara/14. ai-ml/gen-ai/car_expert_chatbot/backend"
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### API Endpoints

- `GET /health` - checks whether the backend is running.
- `POST /chat` - sends a car-related question to the chatbot.

Request example for `POST /chat`:

```json
{
	"message": "Best SUV under 15 lakh?"
}
```

Response example for a car-related question:

```json
{
	"response": "This is a dummy car chatbot response."
}
```

Response example for a non-car question:

```text
Sorry, I only answer car-related questions.
```

### Common Fixes

- If the server does not start, make sure the virtual environment is active and dependencies are installed.
- If you get an API key error, confirm `NVIDIA_API_KEY` is set in `.env`.
- If Swagger does not load, verify Uvicorn is running on `http://127.0.0.1:8000`.
- If CORS errors appear later with React, update `CORS_ORIGINS` in `.env`.

### Final Test Checklist

Use these examples to verify the full project:

- Backend health:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
	"status": "healthy",
	"message": "Car Expert Chatbot backend is running."
}
```

- Car-related question:

```json
{
	"message": "Best SUV under 15 lakh?"
}
```

Expected: a car-related answer from the chatbot.

- Non-car question:

```json
{
	"message": "Who is Virat Kohli?"
}
```

Expected response:

```text
Sorry, I only answer car-related questions.
```

- Frontend test:
	- Type a car question in the chat box.
	- Verify the loading animation appears.
	- Verify the user message stays in history.
	- Verify the bot response appears below it.

If you still see an old response, restart both dev servers and hard refresh the browser.

## Car Expert Chatbot Frontend

This project also includes a simple React frontend for the Car Expert Chatbot.
It uses Tailwind CSS for styling and Axios is prepared for future backend
integration, but the current UI still uses a dummy response.

### Frontend Setup

The frontend lives in:

`14. ai-ml/gen-ai/car_expert_chatbot/frontend`

Setup steps:

1. Open a terminal in the frontend folder.
2. Install npm dependencies.
3. Copy `.env.example` to `.env` if you want to change the API base URL later.
4. Start the Vite development server.

Example commands:

```bash
cd "/home/rushil/rushil-ranpara/14. ai-ml/gen-ai/car_expert_chatbot/frontend"
npm install
cp .env.example .env
npm run dev
```

### Frontend Structure

- `src/main.jsx` - React entry point.
- `src/App.jsx` - chat UI with local state and dummy bot replies.
- `src/index.css` - Tailwind CSS setup and global styling.
- `src/lib/apiClient.js` - Axios client prepared for future API calls.

### Common Fixes

- If the page is blank, make sure `npm install` completed successfully.
- If Tailwind styles are missing, confirm `src/index.css` is imported in `src/main.jsx`.
- If Vite cannot start, check that Node.js is installed and the correct folder is open.
- If you later connect the backend, make sure `VITE_API_BASE_URL` matches the FastAPI URL.
