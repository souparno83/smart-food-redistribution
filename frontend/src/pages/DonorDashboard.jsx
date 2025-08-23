// frontend/src/pages/DonorDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [form, setForm] = useState({
    donor_name: "",
    food_item: "",
    quantity: "",
    location: "",
    image: null,
  });
  const navigate = useNavigate();

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get("http://localhost:5000/api/food/donations", config);
        setDonations(res.data);
        computeTopContributors(res.data);
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };

    fetchDonations();
  }, [navigate]);

  // Compute top contributors
  const computeTopContributors = (donations) => {
    const counts = donations.reduce((acc, d) => {
      acc[d.donor_name] = (acc[d.donor_name] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // top 5
    setTopContributors(sorted);
  };

  // Badge assignment
  const getBadge = (idx) => {
    if (idx === 0) return "🥇 Gold";
    if (idx === 1) return "🥈 Silver";
    if (idx === 2) return "🥉 Bronze";
    return "⭐ Star";
  };

  // Form change
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));

      const res = await axios.post("http://localhost:5000/api/food/donate", formData, config);
      alert("Donation added successfully!");
      setForm({ donor_name: "", food_item: "", quantity: "", location: "", image: null });
      setDonations([res.data, ...donations]);
      computeTopContributors([res.data, ...donations]);
    } catch (err) {
      console.error("Error adding donation:", err);
      alert("Error adding donation.");
    }
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center text-success">🍲 Donor Dashboard</h1>

      {/* Donation Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title text-primary">Add a Donation</h5>
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-6">
              <input
                type="text"
                name="donor_name"
                value={form.donor_name}
                onChange={handleChange}
                className="form-control"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="food_item"
                value={form.food_item}
                onChange={handleChange}
                className="form-control"
                placeholder="Food Item"
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="form-control"
                placeholder="Quantity"
                required
              />
            </div>
            <div className="col-md-5">
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="form-control"
                placeholder="Location"
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-12 d-grid mt-2">
              <button type="submit" className="btn btn-success">
                ➕ Add Donation
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title text-warning">🏆 Top Contributors</h5>
          {topContributors.length === 0 ? (
            <p className="text-muted">No contributions yet.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {topContributors.map(([name, count], idx) => (
                <li key={name} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{name} — {count} donation{count > 1 ? "s" : ""}</span>
                  <span className="badge bg-primary rounded-pill">{getBadge(idx)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Donations List */}
      <h4 className="mb-3 text-secondary">Recent Donations</h4>
      <div className="row">
        {donations.map((d) => (
          <div key={d.id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              {d.image_path && (
                <img
                  src={`http://localhost:5000${d.image_path}`}
                  alt={d.food_item}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{d.food_item}</h5>
                <p className="card-text mb-1"><strong>Quantity:</strong> {d.quantity}</p>
                <p className="card-text mb-1"><strong>Location:</strong> {d.location}</p>
              </div>
            </div>
          </div>
        ))}
        {donations.length === 0 && (
          <p className="text-muted text-center">No donations yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}

export default DonorDashboard;
