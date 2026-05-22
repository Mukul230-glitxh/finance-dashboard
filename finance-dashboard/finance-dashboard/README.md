# FinTrack - Finance Investment Dashboard

A full-stack investment tracker built with React.js, Node.js, Express, and MySQL.

## Tech Stack
- **Frontend**: React.js, Recharts, React Router, Axios
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MySQL with Sequelize ORM

---

## Project Structure

```
finance-dashboard/
├── backend/
│   ├── config/
│   │   └── database.js        # MySQL + Sequelize config
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, GetMe
│   │   ├── portfolioController.js
│   │   └── stockController.js
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── portfolio.js
│   │   ├── stocks.js
│   │   └── transactions.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Auth.js
    │   │   │   └── Auth.css
    │   │   ├── Dashboard/
    │   │   │   ├── Dashboard.js
    │   │   │   └── Dashboard.css
    │   │   └── Portfolio/
    │   │       ├── AddHoldingModal.js
    │   │       └── AddHoldingModal.css
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## Setup & Run

### Prerequisites
- Node.js v16+
- MySQL server running

### 1. Database Setup
```sql
CREATE DATABASE finance_dashboard;
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy and fill environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/portfolio | Get all holdings + summary |
| POST | /api/portfolio/add | Add new holding |
| DELETE | /api/portfolio/:id | Remove holding |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stocks/top | Get top stocks |
| GET | /api/stocks/:symbol | Get single stock price |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | Get transaction history |

---

## Features
- JWT-based authentication (register/login)
- Add, view, delete investment holdings
- Portfolio summary: total invested, current value, P&L
- Pie chart for portfolio allocation
- Bar chart for market snapshot
- Transaction history
- Live market prices (mock data, upgradeable to Alpha Vantage API)
- Responsive design

## Upgrade: Real Stock Prices
Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
and add it to `.env`:
```
ALPHA_VANTAGE_API_KEY=your_key_here
```

---

*Built for DistrictD Software Developer placement - showcases React.js, Node.js, MySQL, REST API design*
