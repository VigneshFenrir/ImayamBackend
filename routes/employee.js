const express = require("express");
const router = express.Router();
const Joi = require("joi");

const employeeModel = require("../models/employeeModel");

//get employees

router.get("/", async (req, res) => {
  try {
    const itemsperpage = 10;
    const pageno = req.query.page;
    const skip = (pageno - 1) * itemsperpage;
    const search = req.query.search;

    if (search) {
      console.log(search);
      const regex = new RegExp(`.*${search}.*`);
      const employees = await employeeModel
        .find({
          $or: [{ name: regex }, { email: regex }],
        })
        .limit(itemsperpage)
        .skip(skip);

      res.send(employees);
    } else {
      const employees = await employeeModel
        .find()
        .limit(itemsperpage)
        .skip(skip);
      res.send(employees);
    }
  } catch (err) {
    console.log(err.message);
  }
});

//get oneemployee
router.get("/one:id", async (req, res) => {
  const id = req.params.id;
  try {
    const employee = await employeeModel.findById(id).select("-_id -__v -Date");
    if (!employee) return res.status(400).send("Given Id does not exits");
    res.send(employee);
  } catch (err) {
    console.log(err.message);
  }
});

//get total count of employees

router.get("/employeeTotal", async (req, res) => {
  console.log("hiii");
  try {
    const employee = await employeeModel.find().countDocuments();
    console.log(employee);
    res.json(employee);
  } catch (err) {
    console.log(err.message);
  }
});

//  Create employee

router.post("/", async (req, res) => {
  try {
    const { error } = validateEmployee(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const employee = new employeeModel({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      designation: req.body.designation,
      course: req.body.course,
      gender: req.body.gender,
    });
    const saveEmployee = await employee.save();
    console.log(saveEmployee);
    res.send("Created employee Successfully");
  } catch (err) {
    console.log(err.message);
  }
});

//Update employee

router.put("/update:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { error } = validateEmployee(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const employee = await employeeModel.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        designation: req.body.designation,
        course: req.body.course,
        gender: req.body.gender,
      },
      { new: true }
    );
    if (!employee) {
      return res.status(400).send("The employee does not exits");
    }
    const saveEmployee = await employee.save();
    console.log(saveEmployee);
    res.send("Updated employee Successfully");
  } catch (err) {
    console.log(err.message);
  }
});

//delete employee

router.delete("/delete:id", async (req, res) => {
  const id = req.params.id;
  try {
    const employee = await employeeModel.findByIdAndDelete(id);
    if (!employee) {
      return res.status(400).send("The employee does not exits");
    }
    res.send("Deleted Successfully");
  } catch (err) {
    console.log(err.message);
  }
});

function validateEmployee(employee) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.number().required(),
    designation: Joi.string().required(),
    course: Joi.array().required(),
    gender: Joi.string().required(),
  });
  const result = schema.validate(employee);
  return result;
}

module.exports = router;
