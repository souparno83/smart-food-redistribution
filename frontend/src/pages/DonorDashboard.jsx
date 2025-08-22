import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({
    donor_name: "",
    food_item: "",
    quantity: "",
    location: ""
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch donations
  useEffect(() => {
    axios.get("http://localhost:5000/api/food/donations", config)
      .then(res => setDonations(res.data))
      .catch(err => console.error("Error fetching donations:", err));
  }, []);

  // Submit donation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/food/donate", form, config);
      setDonations([res.data, ...donations]);
      setForm({ donor_name: "", food_item: "", quantity: "", location: "" });
    } catch (err) {
      console.error("Error donating:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🍲 Donor Dashboard</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="form-control mb-2"
          placeholder="Your Name"
          value={form.donor_name}
          onChange={(e) => setForm({ ...form, donor_name: e.target.value })}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Food Item"
          value={form.food_item}
          onChange={(e) => setForm({ ...form, food_item: e.target.value })}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-success">Donate</button>
      </form>

      <h4>📋 Recent Donations</h4>
      <ul className="list-group">
        {donations.map((d) => (
          <li key={d.id} className="list-group-item">
            <strong>{d.donor_name}</strong> donated <em>{d.food_item}</em> ({d.quantity}) at {d.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonorDashboard;
