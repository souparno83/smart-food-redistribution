import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
      } else {
        // Save token and user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/donor"); // redirect to donor dashboard
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <AnimatedPage>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #56ab2f, #ffb347)",
        }}
      >
        <div className="col-md-6 col-lg-4">
          <div
            className="card shadow-lg rounded-4 p-4 border-0"
            style={{ backgroundColor: "#fffdf5" }}
          >
            <h3 className="text-center mb-3 fw-bold text-success">Create Account ✨</h3>
            <p className="text-center text-muted mb-4">
              Join us and start donating or receiving food 🌍
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control rounded-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control rounded-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                />
              </div>

              {error && <p className="text-danger small">{error}</p>}

              <button type="submit" className="btn btn-success w-100 rounded-3 fw-semibold">
                Sign Up
              </button>
            </form>

            <p className="text-center mt-3 mb-0 text-muted">
              Already have an account?{" "}
              <span
                className="text-success fw-semibold"
                role="button"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Signup;
