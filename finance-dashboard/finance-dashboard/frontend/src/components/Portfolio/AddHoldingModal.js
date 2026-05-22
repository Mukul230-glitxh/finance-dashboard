import React, { useState } from 'react';
import axios from 'axios';
import './AddHoldingModal.css';

const AddHoldingModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    symbol: '',
    companyName: '',
    quantity: '',
    buyPrice: '',
    category: 'Stocks'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/portfolio/add', {
        ...form,
        symbol: form.symbol.toUpperCase(),
        quantity: parseFloat(form.quantity),
        buyPrice: parseFloat(form.buyPrice)
      });
      onAdd();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add holding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Investment</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-row">
            <div className="form-group">
              <label>Stock Symbol</label>
              <input
                type="text"
                placeholder="e.g. AAPL, TCS"
                value={form.symbol}
                onChange={e => setForm({ ...form, symbol: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                placeholder="e.g. Apple Inc."
                value={form.companyName}
                onChange={e => setForm({ ...form, companyName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                placeholder="0"
                min="0.0001"
                step="0.0001"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Buy Price (₹)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={form.buyPrice}
                onChange={e => setForm({ ...form, buyPrice: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option>Stocks</option>
              <option>Mutual Funds</option>
              <option>ETF</option>
              <option>Crypto</option>
            </select>
          </div>

          {form.quantity && form.buyPrice && (
            <div className="total-preview">
              Total Investment: <strong>₹{(form.quantity * form.buyPrice).toFixed(2)}</strong>
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Investment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHoldingModal;
