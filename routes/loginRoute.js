const path = require("path");
const User = require("../model/users");
const bcrypt = require("bcrypt");
const router = require("express").Router();
router.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/login.html"));
});
router.post("/login", async function (req, res) {
  async function retrieveHashedPassword(email) {
    try {
      const user = await User.findOne({ email }).select("password").exec();

      if (!user) {
        // User not found
        console.log("User not found");
        res.send("User not found");
      }

      // Retrieved user with password field (hashed password)
      console.log("Hashed password:", user.password);
      return user.password; // Return the hashed password
    } catch (error) {
      // Handle error
      console.error(error);
      return null;
    }
  }
  const { email, password } = req.body;
  try {
    const user = User.findOne({ email: email });

    if (user) {
      const hashedPassword = await retrieveHashedPassword(email).then(function (
        actualPassword
      ) {
        return actualPassword;
      });
      console.log("Entered password:", password);
      bcrypt.compare(password, hashedPassword, async (err, isMatch) => {
        if (err) {
          console.log("Error occured while comparing");
        } else {
          if (isMatch) {
            req.session.user = await user;
            const userData = req.session.user;
            // res.redirect(
            //   "https://socio-app-y5og.onrender.com/home/" + userData._id
            // );
            res.redirect("https://socio-app-backend-nine.vercel.app/home/" + userData._id);
            // res.render("home", { userData });
          } else {
            res.send("Login failed");
          }
        }
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
