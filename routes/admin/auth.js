const express = require("express");
const { body, validationResult } = require("express-validator");

const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }),
  body("password").trim().isLength({ min: 8, max: 20 }),
  body("passwordConfirmation")
    .trim()
    .isLength({ min: 4, max: 20 })
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
),
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const { email, password, passwordConfirmation } = req.body;
    // Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });
    //Store the id of that user inside the users cookie
    req.session.userId = user.id; // added by cookie-session library

    res.send("Account Created");
  };

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate());
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found");
  }

  if (user.password !== password) {
    return res.send("Invalid password");
  }

  req.session.userId = user.Id;

  res.send("You are signed in");
});

module.exports = router;
