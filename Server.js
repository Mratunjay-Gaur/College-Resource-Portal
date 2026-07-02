require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const session = require("express-session");
const passport = require("passport");
const app = express();
const Member = require("./Models/Member");
const dburl = process.env.DB_URL;
const path = require("path");

app.use(express.static(path.join(__dirname,"Public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(mongoSanitize({
    replaceWith : "_",
    senitizeQuery : false
}));

app.use(
    session({
        secret: "club-secret",
        resave: false,
        saveUninitialized: false,
    })
)

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(dburl)
  .then(() => {
    console.log("Database connected");
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });


app.get("/join-club", (req, res) => {
    res.sendFile(path.join(__dirname, "Public", "Join-Club.html"));
});
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "Public", "home.html"));
});

app.post("/join-club", async (req, res) => {
    try {
        const { name, email, branch } = req.body;

        if (!name || !email) {
            return res.send("Name and Email are required");
        }

        const member = new Member({ name, email, branch });
        await member.save();

        return res.redirect("/home");
    } catch (err) {
        if (err.code === 11000) {
            return res.send("Email already exists.");
        }

        console.error(err);
        return res.send("Error occurred.");
    }
});
app.listen(3000,()=> {
    console.log("server running on port 3000");
})