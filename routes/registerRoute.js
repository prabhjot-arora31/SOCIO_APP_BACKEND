const User = require("../model/users");
const bcrypt = require("bcrypt");
const router = require("express").Router();
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});
router.post("/register", async function (req, res) {
  const { name, email, password, desc, profileImg } = req.body;
  console.log(name, email, password, desc);
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.send("User already registered");
  } else {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
      } else {
        const tmpUser = new User({
          name,
          profileImg,
          email,
          password: hashedPassword,
          description: desc,
        });
        await tmpUser.save();
        console.log(tmpUser);
        res.send(
          "<center>User registered successfully<br/><a href='https://socio-app-y5og.onrender.com/login.html'>Login</a></center>"
        );
      }
    });
  }
});
module.exports = router;
