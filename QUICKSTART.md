# Quick Start Guide

## Prerequisites
- Node.js 16+ with npm
- Python 3.8+
- Git (optional)

## Option 1: Automated Setup (Windows)

Run the setup script:
```bash
cd FT
setup.bat
```

This will automatically:
1. Create Python virtual environment
2. Install backend dependencies
3. Install frontend dependencies

## Option 2: Manual Setup

### Backend Setup

1. Open terminal and navigate to backend:
```bash
cd backend
```

2. Create virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
uvicorn app.main:app --reload
```

Backend will run at: **http://localhost:8000**
API docs available at: **http://localhost:8000/docs**

### Frontend Setup (in a new terminal)

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run at: **http://localhost:5173**

## Testing the Application

### Create an Account
1. Open http://localhost:5173
2. Click "Register"
3. Enter email and password
4. Submit the form

### Add an Account
1. After login, go to "Accounts" page
2. Click "Add Account"
3. Fill in account details (name, type, initial balance)
4. Save

### Add a Transaction
1. Go to "Transactions" page
2. Click "Add Transaction"
3. Fill in transaction details
4. Submit

### Set a Budget
1. Go to "Budget" page
2. Click "Add Budget"
3. Set category and monthly limit
4. Save

### Create a Savings Goal
1. Go to "Savings Goals" page
2. Click "Add Goal"
3. Set goal name, target amount, and deadline
4. Save

### View Dashboard
1. Dashboard shows:
   - Total balance
   - Monthly income/expenses
   - Category breakdown (pie chart)
   - 12-month trend (bar chart)
   - Recent transactions

### Change Language
1. Click the language button in navbar
2. Choose between English and العربية (Arabic)
3. Interface updates instantly with RTL layout

## Build for Production

### Frontend Build
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

### Backend Production
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## Docker Setup (Optional)

Build and run with Docker:
```bash
docker-compose up --build
```

This will start:
- Backend API on http://localhost:8000
- Frontend on http://localhost:5173

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed: `python --version`
- Try removing `financial_tracker.db` and restarting

### Frontend won't start
- Ensure Node.js 16+ is installed: `node --version`
- Delete `node_modules` and run `npm install` again

### CORS errors
- Check that backend CORS_ORIGINS in `.env` includes frontend URL
- Restart both servers after changes

### API calls failing
- Ensure backend is running on http://localhost:8000
- Check frontend `.env` has correct `VITE_API_URL`

## Project Structure

```
FT/
├── frontend/           # React app
├── backend/            # FastAPI app
├── README.md          # Full documentation
├── QUICKSTART.md      # This file
└── docker-compose.yml # Docker setup
```

## Next Steps

1. Explore the Dashboard for financial overview
2. Add multiple accounts for better organization
3. Set up budgets to track spending
4. Create savings goals for future planning
5. Review the full [README.md](README.md) for advanced features

## Support

For issues or questions:
1. Check the full [README.md](README.md)
2. Review the [Copilot Instructions](.github/copilot-instructions.md)
3. Check API documentation at http://localhost:8000/docs

Happy tracking! 💰
