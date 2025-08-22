// backend/routes/map.js
const express = require("express");
const router = express.Router();

const donors = [
  { id: 1, name: "Donor A", lat: 20.595, lng: 78.965, type: "Vegetables" },
  { id: 2, name: "Donor B", lat: 20.592, lng: 78.960, type: "Fruits" },
];
const recipients = [
  { id: 1, name: "Recipient X", lat: 20.594, lng: 78.964 },
  { id: 2, name: "Recipient Y", lat: 20.591, lng: 78.961 },
];

router.get("/donors", (req, res) => res.json(donors));
router.get("/recipients", (req, res) => res.json(recipients));

module.exports = router;
