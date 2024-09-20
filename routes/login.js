const express = require("express");
const Joi = require("joi");
const router = express.Router();
const Jwt = require("jsonwebtoken");

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

    if (!user) {
      return res.status(400).send("Invalid Username or Password");
    }
    const token = Jwt.sign({ role: user.role }, "secretkey", {
      expiresIn: "12d",
    });

    res.setHeader("Token", token);
    res.json({ message: "Logging in successfully", token, role: user.role });
  } catch (err) {
    console.error(err.message);
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
