const express = require("express");
const router = express.Router();
const Joi = require("joi");

const UserModel = require("../models/userModel");

//get users

router.get("/", async (req, res) => {
  try {
    const itemsperpage = 10;
    const pageno = req.query.page;
    const skip = (pageno - 1) * itemsperpage;
    const search = req.query.search;

    if (search) {
      const regex = new RegExp(`.*${search}.*`);
      const users = await UserModel.find({
        $or: [{ username: regex }, { role: regex }],
      })
        .limit(itemsperpage)
        .skip(skip);

      res.send(users);
    } else {
      const users = await UserModel.find().limit(itemsperpage).skip(skip);
      res.send(users);
    }
  } catch (err) {
    console.error(err.message);
  }
});

//get user by id
router.get("/one:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id).select("-_id -__v -Date");
    if (!user) return res.status(400).send("Given Id does not exits");
    res.send(user);
  } catch (err) {
    console.error(err.message);
  }
});

//update user

router.put("/update:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        username: req.body.username,
        role: req.body.role,
      },
      { new: true }
    );
    if (!user) {
      return res.status(400).send("The user does not exits");
    }

    res.send("Updated user Successfully");
  } catch (err) {
    console.error(err.message);
  }
});

//delete user
router.delete("/delete:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).send("The user does not exits");
    }
    res.send("Deleted Successfully");
  } catch (err) {
    console.error(err.message);
  }
});

//  register || create user

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { username, role, password } = req.body;
    const userExist = await UserModel.findOne({ username });
    if (userExist) {
      return res.status(400).send("username already exists");
    }

    const user = new UserModel({
      username,
      role,
      password,
    });
    await user.save();
    res.send("Created Successfully");
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/userTotal", async (req, res) => {
  try {
    const user = await UserModel.find().countDocuments();
    res.json(user);
  } catch (err) {
    console.error(err.message);
  }
});

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().required(),
    role: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(user);
  return result;
}

module.exports = router;
