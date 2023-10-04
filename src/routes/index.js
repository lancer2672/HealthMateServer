const routes = require("express").Router();
const authRoutes = require("./auth.route");

routes.use("/auth", authRoutes);
