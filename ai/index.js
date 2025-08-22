const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chatRoutes = require("./routes/chat");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/ai", chatRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`AI server running on port ${PORT}`));
