import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ name: data.name, email }));

        navigate("/donor");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #56ab2f, #ffb347)", // 🌿 Green + 🍊 Orange
      }}
    >
      <div className="col-md-6 col-lg-4">
        <div
          className="card shadow-lg rounded-4 p-4 border-0"
          style={{ backgroundColor: "#fffdf5" }} // soft off-white
        >
          <h2 className="text-center text-success fw-bold mb-3">🍲 Login</h2>
          <p className="text-center text-muted mb-4">
            Welcome back! Let’s reduce food waste together 🌍
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control rounded-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  transition: "all 0.4s ease-in-out",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 8px #56ab2f")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control rounded-3"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  transition: "all 0.4s ease-in-out",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 8px #56ab2f")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>

            {error && <p className="text-danger small">{error}</p>}

            <button
              type="submit"
              className="btn btn-success w-100 rounded-3 fw-semibold"
              style={{
                transition: "transform 0.2s ease, background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              ✅ Login
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="small text-muted">
              Don’t have an account?{" "}
              <a href="/register" className="fw-semibold text-success text-decoration-none">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
