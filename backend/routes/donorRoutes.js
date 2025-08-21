const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Donor dashboard data");
});

module.exports = router;
