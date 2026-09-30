import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "http://localhost:5000/api/foods";

function App() {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [cart, setCart] = useState({});
  const [errors, setErrors] = useState({});

  const fetchFoods = async () => {
    try {
      const response = await axios.get(API_URL);
      const managedData = response.data.map(item => ({ ...item, quantity: 1 }));
      setFoods(managedData);
    } catch (error) {
      console.error("API Connection Error:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const categories = [...new Set(foods.map(item => item.category))];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!form.name.trim()) formErrors.name = "Food name is required.";
    if (!form.price) {
      formErrors.price = "Price is required.";
    } else if (isNaN(form.price) || Number(form.price) <= 0) {
      formErrors.price = "Enter a valid price greater than 0.";
    }
    if (!form.category) formErrors.category = "Please choose a category.";
    if (!form.description.trim()) formErrors.description = "Description cannot be blank.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const foodData = { ...form, price: Number(form.price) };
    try {
      if (editingId === null) {
        const response = await axios.post(API_URL, foodData);
        alert(response.data.message);
      } else {
        const response = await axios.put(`${API_URL}/${editingId}`, foodData);
        alert(response.data.message);
        setEditingId(null);
      }
      setForm({ name: '', price: '', category: '', description: '' });
      setErrors({});
      fetchFoods();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed.");
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, price: item.price, category: item.category, description: item.description });
    setEditingId(item.id);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (confirm("Permanently delete this food item from the database?")) {
      try {
        const response = await axios.delete(`${API_URL}/${id}`);
        alert(response.data.message);
        fetchFoods();
      } catch (error) {
        alert("Failed to delete record.");
      }
    }
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const currentQty = prevCart[item.id]?.quantity || 0;
      return {
        ...prevCart,
        [item.id]: { id: item.id, name: item.name, price: Number(item.price), quantity: currentQty + 1 }
      };
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => {
      if (!prevCart[id]) return prevCart;
      const currentQty = prevCart[id].quantity;
      if (currentQty <= 1) {
        const updatedCart = { ...prevCart };
        delete updatedCart[id];
        return updatedCart;
      }
      return { ...prevCart, [id]: { ...prevCart[id], quantity: currentQty - 1 } };
    });
  };

  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const gstTax = subtotal * 0.05;
  const grandTotal = subtotal + gstTax;

  return (
    <div className="dashboard-container">
      {/* 🏛️ Top Brand Layout Row Panel Container Header */}
      <header className="header-panel">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQkKujThmkbUKA7_gXhAiZ-Alo8LOUjZbBFcCBR2Yte21m93x4snbJOBeM&s=10k" alt="Chef Logo" className="logo" />
        <h1>Restaurant Administration Grid Dashboard</h1>
      </header>

      {/* 📊 Main Split Side-by-Side Dual-Panel Container Layout */}
      <main className="dashboard-grid">
        
        {/* Left Grid Side Panel Panel: Management Form Section */}
        <section className="card">
          <h2>{editingId ? "📝 Edit Menu Item" : "➕ Add New Menu Item"}</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label>Food Item Name</label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleInputChange} 
                placeholder="e.g., Margherita Pizza"
                className={errors.name ? "error-input" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label>Price (INR)</label>
              <input 
                type="number" 
                name="price" 
                value={form.price} 
                onChange={handleInputChange} 
                placeholder="e.g., 250"
                className={errors.price ? "error-input" : ""}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="input-group">
              <label>Category Grouping</label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleInputChange}
                className={errors.category ? "error-input" : ""}
              >
                <option value="">-- Choose Category --</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Beverages">Beverages</option>
                <option value="Dessert">Dessert</option>
                <option value="Main Course">Main Course</option>
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            <div className="input-group">
              <label>Item Recipe Description</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleInputChange} 
                rows="4" 
                placeholder="Describe flavors, toppings, or ingredients..."
                className={errors.description ? "error-input" : ""}
              ></textarea>
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Item Record" : "Save to Database"}
            </button>
          </form>
        </section>

        {/* Right Grid Side Panel: Live Menu Table Overview & Receipt Summary */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="card">
            <h2>📦 Active Restaurant Menu Catalog</h2>
            {foods.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No entries found in MySQL database. Register a food item above!</p>
            ) : (
              categories.map(categoryName => (
                <div key={categoryName} className="category-section">
                  <div className="category-title">📂 {categoryName}</div>
                  <table className="food-table">
                    <thead>
                      <tr>
                        <th>Food Details</th>
                        <th>Price</th>
                        <th>Billing Queue</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foods.filter(item => item.category === categoryName).map(item => (
                        <tr key={item.id}>
                          <td className="item-meta">
                            <strong>{item.name}</strong>
                            <span>{item.description}</span>
                          </td>
                          <td><strong>₹{item.price}</strong></td>
                          <td>
                            <div className="quantity-badge-controls">
                              <button type="button" className="btn-qty" onClick={() => removeFromCart(item.id)}>-</button>
                              <span className="qty-val">{cart[item.id]?.quantity || 0}</span>
                              <button type="button" className="btn-qty" onClick={() => addToCart(item)}>+</button>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                              <button type="button" className="btn btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                              <button type="button" className="btn btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>

          {/* 🧾 Customer Receipt Summary Generation Widget Container Block */}
          {cartItems.length > 0 && (
            <div className="receipt-box">
              <h3 style={{ textAlign: 'center', fontSize: '18px', color: '#2c3e50', letterSpacing: '0.5px' }}>🧾 CUSTOMER INVOICE RECEIPT</h3>
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Item</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name} (@ ₹{item.price})</td>
                      <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="receipt-summary-row" style={{ borderTop: '2px dashed #e2e8f0' }}>
                    <td colSpan="2" style={{ padding: '12px 0 4px', color: '#64748b' }}>Basket Subtotal:</td>
                    <td style={{ textAlign: 'right', padding: '12px 0 4px', fontWeight: '600' }}>₹{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr className="receipt-summary-row">
                    <td colSpan="2" style={{ padding: '4px 0', color: '#64748b' }}>Central Food Service Tax (GST 5%):</td>
                    <td style={{ textAlign: 'right', padding: '4px 0', color: '#64748b' }}>₹{gstTax.toFixed(2)}</td>
                  </tr>
                  <tr className="receipt-summary-row" style={{ fontSize: '18px', fontWeight: '700', color: '#2ecc71' }}>
                    <td colSpan="2" style={{ padding: '10px 0 0' }}>Grand Total Payable:</td>
                    <td style={{ textAlign: 'right', padding: '10px 0 0' }}>₹{grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              <button type="button" className="btn btn-primary" onClick={() => {
                alert(`🧾 Order Invoiced Successfully!\nTotal Paid Amount: ₹${grandTotal.toFixed(2)}`);
                setCart({});
              }} style={{ marginTop: '15px' }}>
                Generate Order Invoice
              </button>
            </div>
          )}
        </section>

      </main>
      <footer>© 2026 Full-Stack Restaurant Management Panel System Framework</footer>
    </div>
  );
}

export default App;
