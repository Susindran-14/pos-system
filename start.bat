@echo off
echo ======================================================================
echo STARTING TAMIL DRESS COLLECTION POS (FASTAPI + REACT.JS)
echo ======================================================================
echo.
echo 1. Starting FastAPI Backend on http://localhost:8000 ...
start "POS Backend (FastAPI)" cmd /k "cd backend && .\venv\Scripts\python run.py"

echo 2. Starting React Frontend on http://localhost:5173 ...
start "POS Frontend (React)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo ======================================================================
