const mongoose = require("mongoose");
const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  course: {
    type: Array,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

module.exports = EmployeeModel;
