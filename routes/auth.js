const express = require("express");
const router = express.Router();

const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../validations/validation");

const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

// register route
router.post("/register", async (req, res) => {
  // validate the req.body and send back to user
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] });
  }

  // validation 2 to check if user exists via email
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(400).send({ message: "User already exists!" });
  }

  // add randomness to your key
  const salt = await bcryptjs.genSalt(5);
  // take body, return me hashed representation of my password
  const hashedPassword = await bcryptjs.hash(req.body.password, salt);

  // code to insert data
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send({ message: error });
  }
});

router.post("/login", async (req, res) => {
  // validation 1 check user input
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] });
  }

  // validation 2 to check user exists
  const userExists = await User.findOne({ email: req.body.email });
  if (!userExists) {
    return res.status(400).send({ message: "User does not exists!" });
  }

  // validation 3 to check password
  const passwordValidation = await bcryptjs.compare(
    req.body.password,
    userExists.password
  );

  if (!passwordValidation) {
    return res.status(400).send({ message: "Incorrect Password!" });
  }
  // success = give the user to login to your service
  // use auth token to access the film app
  // only user with token will be able to access
  // Generate an auth token USING USER ID AND TOEKN SECRET
  const token = jsonwebtoken.sign(
    { _id: userExists._id },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).send({ "auth-token": token });
});

router.post("/changepassword", async (req, res) => {});

module.exports = router;
