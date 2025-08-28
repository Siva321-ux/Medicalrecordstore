const express = require("express");
const mongoose = require("mongoose");
const user =require("../backend/models/userModels")
const routes = require("./routes/userRoutes"); 
const cors = require("cors");
const app = express();
app.use(cors({
  origin: '*', 
}));
require('dotenv').config()

app.use(express.json());
app.use("/app/api", routes); 

mongoose.connect(process.env.URL)
  .then(() => {
    app.listen(5001, "0.0.0.0", () => {
      console.log(" Connected to MongoDB & server running on port 5001");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
