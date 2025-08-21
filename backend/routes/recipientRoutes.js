const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Recipient map data");
});

module.exports = router;
