import React from "react";
import AnimatedPage from "../components/AnimatedPage";

const Login = () => {
  return (
    <AnimatedPage>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Login</h2>
        <div className="card shadow p-4">
          <form>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input type="password" className="form-control" />
            </div>
            <button className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Login;
