const express = require("express");
const connectDB = require("./databse/connectDB");
const app = express();
const cors = require("cors");
const path = require("path");

app.set("trust proxy", 1);
// DATABASE CONNECTION
connectDB();

// middlewares
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use("/", require("./routes/routes"));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
