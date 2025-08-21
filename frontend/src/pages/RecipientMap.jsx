import React from "react";

const RecipientMap = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Find Nearby Food Recipients 🗺️</h2>
      <div className="card shadow p-4 text-center">
        <p className="lead">Interactive Map will be shown here.</p>
        <div style={{ height: "400px", background: "#e9ecef", borderRadius: "8px" }}>
          <p className="pt-5">[Map Placeholder]</p>
        </div>
      </div>
    </div>
  );
};

export default RecipientMap;
