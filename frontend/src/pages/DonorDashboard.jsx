import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({
    donor_name: "",
    food_item: "",
    quantity: "",
    location: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user"); // save user during login
  const donorName = storedUser ? JSON.parse(storedUser).name : "Donor";

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch donations
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/food/donations", config)
      .then((res) => setDonations(res.data))
      .catch((err) => console.error("Error fetching donations:", err));
  }, []);

  // Submit donation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/food/donate",
        form,
        config
      );
      setDonations([res.data, ...donations]);
      setForm({ donor_name: "", food_item: "", quantity: "", location: "" });
    } catch (err) {
      console.error("Error donating:", err);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success">🍲 Donor Dashboard</h2>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold text-primary">
            👋 Welcome, {donorName}
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm rounded-3 fw-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Donation Form */}
      <div className="card shadow-lg rounded-4 mb-4">
        <div className="card-body">
          <h5 className="card-title fw-semibold mb-3 text-primary">
            Add a Donation
          </h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control rounded-3"
                placeholder="Your Name"
                value={form.donor_name}
                onChange={(e) =>
                  setForm({ ...form, donor_name: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control rounded-3"
                placeholder="Food Item"
                value={form.food_item}
                onChange={(e) =>
                  setForm({ ...form, food_item: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control rounded-3"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control rounded-3"
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                required
              />
            </div>
            <div className="col-12 d-grid">
              <button
                type="submit"
                className="btn btn-success rounded-3 fw-semibold"
              >
                ➕ Donate
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="card shadow rounded-4">
        <div className="card-body">
          <h5 className="card-title fw-semibold mb-3 text-primary">
            📋 Recent Donations
          </h5>
          {donations.length === 0 ? (
            <p className="text-muted">No donations yet. Be the first! 🎉</p>
          ) : (
            <ul className="list-group list-group-flush">
              {donations.map((d) => (
                <li
                  key={d.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{d.donor_name}</strong> donated{" "}
                    <span className="fw-semibold text-success">
                      {d.food_item}
                    </span>{" "}
                    ({d.quantity}) at{" "}
                    <span className="text-muted">{d.location}</span>
                  </div>
                  <span className="badge bg-success rounded-pill">
                    ✅ Active
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
