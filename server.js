const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const User = require("./routes/user");
const Employee = require("./routes/employee");
const login = require("./routes/login");

//mongoose connect

mongoose
  .connect("mongodb://localhost:27017/dealsdray")
  .then(() => {
    console.log("MongoDb connected");
  })
  .catch((err) => {
    console.log(err);
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//routes
app.use("/users", User);
app.use("/employee", Employee);
app.use("/login", login);

// connection of mongodb
const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`server listening the port ${PORT}`);
});
