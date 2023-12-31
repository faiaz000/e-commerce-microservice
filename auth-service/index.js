const express = require("express");
const app = express();
const PORT = process.env.PORT_AUTH || 7070;

const mongoose = require("mongoose");
const User = require("./User");
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb://127.0.0.1/auth-service", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Auth-Service Database Connected");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Auth Servcie Listening at Port: ${PORT}`);
});

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: "User doesn't exist" });
    } else {
        if (password !== user.password) {
            return res.json({ message: "Password Incorrect" });
        }
        const payload = {
            email,
            name: user.name
        };
        jwt.sign(payload, "secret", (err, token) => {
            if (err) console.log(err);
            else return res.json({ token: token });
        });
    }
});

app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ message: "User already exists" });
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });

    newUser.save();
    return res.json(newUser);
  }
});
