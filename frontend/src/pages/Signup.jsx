import React from "react";

const Signup = () => {
  return (
    <div className="container mt-5">
      <div className="card shadow p-4 col-md-6 mx-auto">
        <h2 className="text-center mb-4">Sign Up 📝</h2>
        <form>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" className="form-control" placeholder="Enter full name" />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" placeholder="Enter email" />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Enter password" />
          </div>
          <button type="submit" className="btn btn-success w-100">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
