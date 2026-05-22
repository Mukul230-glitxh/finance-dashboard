import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import AddHoldingModal from '../Portfolio/AddHoldingModal';
import './Dashboard.css';

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState({ holdings: [], summary: {} });
  const [stocks, setStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [portfolioRes, stocksRes, txRes] = await Promise.all([
        axios.get('/api/portfolio'),
        axios.get('/api/stocks/top'),
        axios.get('/api/transactions')
      ]);
      setPortfolio(portfolioRes.data);
      setStocks(stocksRes.data);
      setTransactions(txRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHolding = async (id) => {
    if (!window.confirm('Remove this holding?')) return;
    await axios.delete(`/api/portfolio/${id}`);
    fetchData();
  };

  const { summary = {}, holdings = [] } = portfolio;
  const profitLoss = parseFloat(summary.profitLoss || 0);
  const isProfit = profitLoss >= 0;

  // Pie chart data
  const pieData = holdings.map(h => ({
    name: h.symbol,
    value: parseFloat(h.currentPrice) * parseFloat(h.quantity)
  }));

  // Bar chart - top stocks
  const barData = stocks.slice(0, 6).map(s => ({
    symbol: s.symbol,
    price: s.price,
    change: s.change
  }));

  if (loading) return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p>Loading your portfolio...</p>
    </div>
  );

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>📈</span> FinTrack
        </div>
        <nav>
          {['overview', 'portfolio', 'markets', 'transactions'].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' && '🏠'}
              {tab === 'portfolio' && '💼'}
              {tab === 'markets' && '📊'}
              {tab === 'transactions' && '📋'}
              {' '}{tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <p className="user-name">{user?.name}</p>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add Investment
          </button>
        </header>

        {/* Summary Cards */}
        {activeTab === 'overview' && (
          <>
            <div className="summary-cards">
              <div className="card">
                <p className="card-label">Total Invested</p>
                <h3>₹{parseFloat(summary.totalInvested || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
              </div>
              <div className="card">
                <p className="card-label">Current Value</p>
                <h3>₹{parseFloat(summary.currentValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
              </div>
              <div className={`card ${isProfit ? 'profit' : 'loss'}`}>
                <p className="card-label">Profit / Loss</p>
                <h3>{isProfit ? '+' : ''}₹{Math.abs(profitLoss).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                <span className="badge">{summary.profitLossPercent}%</span>
              </div>
              <div className="card">
                <p className="card-label">Holdings</p>
                <h3>{holdings.length}</h3>
              </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              <div className="chart-card">
                <h4>Portfolio Allocation</h4>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(val) => `₹${val.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p className="empty-chart">Add investments to see allocation</p>}
              </div>

              <div className="chart-card">
                <h4>Market Snapshot</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="symbol" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="change" fill="#4CAF50"
                      label={false}
                      cell={barData.map((d, i) => (
                        <Cell key={i} fill={d.change >= 0 ? '#4CAF50' : '#f44336'} />
                      ))}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="section-card">
              <h4>Recent Transactions</h4>
              {transactions.slice(0, 5).length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr><th>Symbol</th><th>Type</th><th>Qty</th><th>Price</th><th>Total</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map(tx => (
                      <tr key={tx.id}>
                        <td><strong>{tx.symbol}</strong></td>
                        <td><span className={`badge ${tx.type === 'BUY' ? 'buy' : 'sell'}`}>{tx.type}</span></td>
                        <td>{tx.quantity}</td>
                        <td>₹{tx.price}</td>
                        <td>₹{tx.total}</td>
                        <td>{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="empty-msg">No transactions yet</p>}
            </div>
          </>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="section-card">
            <h4>Your Holdings</h4>
            {holdings.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Symbol</th><th>Company</th><th>Category</th>
                    <th>Qty</th><th>Avg Price</th><th>Current</th>
                    <th>Invested</th><th>Value</th><th>P&L</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map(h => {
                    const invested = parseFloat(h.avgBuyPrice) * parseFloat(h.quantity);
                    const current = parseFloat(h.currentPrice) * parseFloat(h.quantity);
                    const pl = current - invested;
                    return (
                      <tr key={h.id}>
                        <td><strong>{h.symbol}</strong></td>
                        <td>{h.companyName}</td>
                        <td><span className="badge">{h.category}</span></td>
                        <td>{h.quantity}</td>
                        <td>₹{h.avgBuyPrice}</td>
                        <td>₹{h.currentPrice}</td>
                        <td>₹{invested.toFixed(2)}</td>
                        <td>₹{current.toFixed(2)}</td>
                        <td className={pl >= 0 ? 'profit-text' : 'loss-text'}>
                          {pl >= 0 ? '+' : ''}₹{pl.toFixed(2)}
                        </td>
                        <td>
                          <button className="delete-btn" onClick={() => deleteHolding(h.id)}>✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : <p className="empty-msg">No holdings yet. Add your first investment!</p>}
          </div>
        )}

        {/* Markets Tab */}
        {activeTab === 'markets' && (
          <div className="section-card">
            <h4>Live Market Prices</h4>
            <div className="stocks-grid">
              {stocks.map(s => (
                <div key={s.symbol} className="stock-card">
                  <div className="stock-header">
                    <strong>{s.symbol}</strong>
                    <span className={`change ${s.change >= 0 ? 'up' : 'down'}`}>
                      {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.changePercent).toFixed(2)}%
                    </span>
                  </div>
                  <p className="stock-name">{s.name}</p>
                  <p className="stock-price">₹{s.price.toLocaleString()}</p>
                  <p className={`stock-change ${s.change >= 0 ? 'up' : 'down'}`}>
                    {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="section-card">
            <h4>Transaction History</h4>
            {transactions.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr><th>Symbol</th><th>Type</th><th>Qty</th><th>Price</th><th>Total</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td><strong>{tx.symbol}</strong></td>
                      <td><span className={`badge ${tx.type === 'BUY' ? 'buy' : 'sell'}`}>{tx.type}</span></td>
                      <td>{tx.quantity}</td>
                      <td>₹{tx.price}</td>
                      <td>₹{tx.total}</td>
                      <td>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="empty-msg">No transactions yet</p>}
          </div>
        )}
      </main>

      {showModal && (
        <AddHoldingModal
          onClose={() => setShowModal(false)}
          onAdd={() => { setShowModal(false); fetchData(); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
