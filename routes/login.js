const express = require("express");
const Joi = require("joi");
const router = express.Router();
const UserModel = require("../models/userModel");

//login post

router.post("/", async (req, res) => {
  try {
    const { error } = validatelogin(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username, password });
    console.log(user);
    if (!user) {
      return res.status(400).send("Invalid Username or Password");
    }
    res.send("Logging in successfully");
  } catch (err) {
    console.log(err.message);
  }
});

//validate login

function validatelogin(user) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(user);
  return result;
}
module.exports = router;
