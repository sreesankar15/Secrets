//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();

app.use(express.static("public")); // To serve static files
app.set("view engine", "ejs"); // To set the view engine to ejs
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/UserDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;


const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            console.log(err);
        } else {
            const newUser = User({
                email: req.body.username,
                password: hash,
            });

            newUser.save(err => {
                if (err) {
                    console.log(err);
                } else {
                    res.render("secrets");
                }
            });
        }
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result === true) {
                        res.render("secrets");
                    }
                });
            }
        }
    });
});










app.listen(3000, () => {
    console.log("Server started on port 3000.");
});