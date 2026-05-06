#!/bin/bash

# Personal Financial Tracker Setup Script for macOS/Linux

echo ""
echo "========================================"
echo "Personal Financial Tracker Setup"
echo "========================================"
echo ""

# Setup Backend
echo "Setting up Backend..."
cd backend

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo "Backend setup complete!"
echo ""

# Setup Frontend
cd ../frontend
echo "Setting up Frontend..."

npm install

echo "Frontend setup complete!"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
