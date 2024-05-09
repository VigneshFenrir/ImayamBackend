const express = require("express");
const router = express.Router();
const Joi = require("joi");

const UserModel = require("../models/userModel");

//get users

router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (err) {
    console.log(err.message);
  }
});

//get oneuser
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (!user) return res.status(400).send("Given Id does not exits");
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});

//  Create User

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { username } = req.body;
    const userExist = await UserModel.findOne({ username });
    console.log(userExist);
    if (userExist) {
      return res.status(400).send("username already exists");
    }

    const { password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json("password does not match");
    }
    const user = new UserModel({
      username: req.body.username,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
    });
    const saveUser = await user.save();
    console.log(saveUser);
    res.send("Created User Successfully");
  } catch (err) {
    console.log(err.message);
  }
});

//Update user

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json("password does not match");
    }
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        username: req.body.username,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).send("The User does not exits");
    }
    const saveUser = await user.save();
    console.log(saveUser);
    res.send("Updated User Successfully");
  } catch (err) {
    console.log(err.message);
  }
});

//delete user

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).send("The User does not exits");
    }
    res.send("Deleted Successfully");
  } catch (err) {
    console.log(err.message);
  }
});

//validate user

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.number().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().required(),
  });
  const result = schema.validate(user);
  return result;
}

module.exports = router;
