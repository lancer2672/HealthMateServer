const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
// const mainRoute = require("./routes");
const path = require("path");

connectDB();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/", mainRoute);

app.listen(process.env.PORT, () => console.log(`server started`));
