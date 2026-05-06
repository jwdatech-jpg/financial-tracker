# Personal Financial Tracker

A comprehensive web application for tracking personal finances with support for multiple accounts, transactions, budgets, and savings goals. Built with React frontend and FastAPI backend with bilingual (English/Arabic) support.

## Features

- **User Authentication**: Secure registration and login using JWT and bcrypt
- **Account Management**: Support for Cash, Bank, Credit Card, and Savings accounts
- **Transaction Tracking**: Record income and expenses with categories, notes, and recurring options
- **Budget Management**: Set monthly budgets per category with alerts at 80% and 100% usage
- **Savings Goals**: Create and track progress toward savings goals with deadlines
- **Dashboard**: Visual analytics with:
  - Monthly summaries
  - Category breakdown (donut chart)
  - 12-month trend analysis (bar chart)
- **Bilingual Support**: Full Arabic/English support with RTL layout for Arabic
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- react-i18next for internationalization
- Recharts for data visualization
- Axios for API communication

### Backend
- FastAPI with Python
- SQLAlchemy ORM
- JWT authentication
- Bcrypt password hashing
- SQLite database (can be switched to PostgreSQL)

## Project Structure

```
FT/
├── frontend/                 # React/Vite application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── locales/         # i18n translation files
│   │   ├── styles/          # Global styles
│   │   └── utils/           # Utility functions
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── core/            # Configuration & database
│   │   ├── utils/           # Helper functions
│   │   └── main.py          # Application entry point
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
└── copilot-instructions.md
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- pip

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

5. Run the server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Accounts
- `GET /accounts` - Get all accounts
- `POST /accounts` - Create new account
- `PUT /accounts/{id}` - Update account
- `DELETE /accounts/{id}` - Delete account

### Transactions
- `GET /transactions` - Get all transactions
- `POST /transactions` - Create transaction
- `DELETE /transactions/{id}` - Delete transaction

### Budgets
- `GET /budgets` - Get all budgets
- `POST /budgets` - Create budget
- `DELETE /budgets/{id}` - Delete budget

## Deployment

### Deploy to Vercel

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

Quick start:

1. **Prepare repository**:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Push to GitHub**:
```bash
git remote add origin https://github.com/yourusername/financial-tracker.git
git push -u origin main
```

3. **Deploy to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Set environment variables (DATABASE_URL, SECRET_KEY, etc.)
   - Click Deploy

**Environment Variables Required**:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key
- `FRONTEND_URL` - Your Vercel deployment URL
- `VITE_API_URL` - Set to `/api`

### Docker Deployment

Build and run with Docker:
```bash
docker-compose up -d
```

## Security Features

- ✅ JWT token-based authentication with 24-hour expiration
- ✅ Bcrypt password hashing with salt
- ✅ CORS protection configured for your domain
- ✅ Input validation using Pydantic schemas
- ✅ SQL injection protection via SQLAlchemy ORM
- ✅ Secure password requirements
- ✅ Environment variable management
- ✅ HTTPS enforced in production

## Bilingual Support

The application includes full support for English and Arabic with:
- Language switcher in the navbar
- Automatic RTL layout for Arabic
- All financial terms translated
- Month names localized
- Currency formatting by locale
- Number formatting by language

Supported languages:
- English
- العربية (Arabic)

## Performance Optimizations

- Frontend code splitting and lazy loading
- React component memoization
- API request debouncing
- Database query optimization
- Production build minification

## Browser Support

- Chrome/Chromium (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please create an issue on GitHub or contact the development team.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

Developed as a comprehensive personal finance management solution.

### Goals
- `GET /goals` - Get all savings goals
- `POST /goals` - Create goal
- `PUT /goals/{id}` - Update goal
- `DELETE /goals/{id}` - Delete goal

### Dashboard
- `GET /dashboard/summary` - Get dashboard summary data
- `GET /dashboard/chart` - Get chart data

## Configuration

### Frontend Environment Variables
```
VITE_API_URL=http://localhost:8000
```

### Backend Environment Variables
```
DATABASE_URL=sqlite:///./financial_tracker.db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
For production deployment, use:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## Bilingual Support

The application supports English and Arabic with:
- Automatic RTL layout for Arabic using CSS logical properties
- IBM Plex Sans and IBM Plex Sans Arabic fonts
- Number and date formatting using `Intl.NumberFormat` and `Intl.DateTimeFormat`
- Language preference stored in user profile

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and feature requests, please create an issue in the repository.
