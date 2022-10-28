const User = require("../models/schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.GetSign = async (req, res, next) => {
  try {
    res.render("signup.ejs");
  } catch (error) {
    console.log(error.message);
  }
};
exports.GetLogIn = async (req, res, next) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};
exports.dashboard = async (req, res) => {
  try {
    res.render("dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

exports.logout = (req, res) => {
  try {


    // destroy session data
    req.session = null;
  
    // redirect to homepage
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};
exports.resetPassword = async (req, res) => {
  try {
    res.render("resetPassword");
  } catch (error) {
    console.log(error.message);
  }
};
exports.Home = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.loginEmail });
    if (!user) {
      return res.status(400).render("error");
    }
    const isMatch = await bcrypt.compare(req.body.loginPassword, user.Password);
    if (!isMatch) {
      return res.status(400).redirect("/login");
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.redirect("/dashboard");
        res.json({
          tok: token,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
exports.Create = async (req, res) => {
  try {
    const { Password, Email, userName, passConfirm } = req.body;
    if (!(Email && Password && userName && passConfirm)) {
      throw new Error("please include all fields");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(Password, salt);
    const hashedConfirm = await bcrypt.hash(passConfirm, salt);
    const user = new User({
      userName,
      Email,
      Password: hashedPass,
      passConfirm: hashedConfirm,
    });
    user
      .save()
      .then((payload) => {
        console.log(payload);
        res.redirect("/login");
      })
      .catch((error) => {
        res.render("error", error);
      });
  } catch (error) {
    console.log(error.essage);
  }
};

exports.findAll = async (req, res) => {
  try {
    User.find()
      .then((users) => {
        res.render("users", { users: User.userName });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "an error occurred while retrieving users",
        });
      });
  } catch (error) {
    console.log(error.message);
  }
};
exports.findById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "user was not found with id " + req.params.id,
        });
      }
      res.json({ user });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user was not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving post with id " + req.params.id,
      });
    });
};
exports.Delete = async (req, res) => {
  try {
    User.findByIdAndDelete(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: "user was not found with id " + req.params.id,
          });
        }
        res.send({ message: "user has been deleted successfully!" });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            message: "user was not found with id " + req.params.id,
          });
        }
        return res.status(500).send({
          message: "Could not delete user with id " + req.params.id,
        });
      });
  } catch (error) {
    console.log(error.message);
  }
};
exports.findAndUpdate = async (req, res) => {
  try {
    User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          Email: req.body.Email,
          Password: req.body.Password,
        },
      },
      {
        new: true,
        upsert: true,
      }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: "user was not found with id " + req.params.id,
          });
        }
        res.send(user);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "user was not found with id " + req.params.id,
          });
        }
        return res.status(500).send({
          message: "Error updating post with id " + req.params.id,
        });
      });
  } catch (error) {
    console.log(error.message);
  }
};
