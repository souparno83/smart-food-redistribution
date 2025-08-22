import { pool } from "./db.js";

export async function insertSampleData() {
  try {
    // --------------------
    // Sample donors in Kolkata
    // --------------------
    const donors = [
      { name: "Donor A", lat: 22.5726, lng: 88.3639, type: "Vegetables" }, // near Esplanade
      { name: "Donor B", lat: 22.5750, lng: 88.3700, type: "Fruits" },     // near Park Street
      { name: "Donor C", lat: 22.5670, lng: 88.3600, type: "Dairy" },      // near Howrah Bridge
      { name: "Donor D", lat: 22.5800, lng: 88.3705, type: "Grains" },     // near Rabindra Sadan
      { name: "Donor E", lat: 22.5650, lng: 88.3750, type: "Other" },      // near Ballygunge
    ];

    for (const d of donors) {
      await pool.query(
        `INSERT INTO donors (name, latitude, longitude, food_type) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT DO NOTHING`,
        [d.name, d.lat, d.lng, d.type]
      );
    }

    // --------------------
    // Sample recipients in Kolkata
    // --------------------
    const recipients = [
      { name: "Recipient X", lat: 22.5730, lng: 88.3640 }, // near Esplanade
      { name: "Recipient Y", lat: 22.5760, lng: 88.3680 }, // near Park Street
      { name: "Recipient Z", lat: 22.5690, lng: 88.3610 }, // near Howrah
      { name: "Recipient W", lat: 22.5820, lng: 88.3710 }, // near Rabindra Sadan
      { name: "Recipient V", lat: 22.5665, lng: 88.3740 }, // near Ballygunge
    ];

    for (const r of recipients) {
      await pool.query(
        `INSERT INTO recipients (name, latitude, longitude) 
         VALUES ($1, $2, $3) 
         ON CONFLICT DO NOTHING`,
        [r.name, r.lat, r.lng]
      );
    }

    console.log("✅ Sample donor and recipient data inserted for Kolkata region");
  } catch (err) {
    console.error("❌ Error inserting sample data:", err);
  }
}
