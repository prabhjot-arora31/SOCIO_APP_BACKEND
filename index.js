const express = require("express");
const path = require("path");
// const logoImage = require("../backend/views/logo.png");
const fs = require("fs");
const app = express();
const db = require("./db/db");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./model/users");
const Post = require("./model/posts");
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "yourSecret", // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded(true));
db();
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.post("/register", async function (req, res) {
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
          "<center>User registered successfully<br/><a href='http://localhost:3001/login'>Login</a></center>"
        );
      }
    });
  }
});
app.post("/create-post", async (req, res) => {
  const { imageUrl, postDescription, _id } = req.body;
  console.log("Image URL: " + imageUrl + " " + postDescription);
  try {
    const post = new Post({
      imageUrl,
      postDesc: postDescription,
      author: { userId: _id },
    });
    console.log("Post is:" + post);
    await post.save();
    // res.send("Post created successfully");
    res.redirect("http://localhost:3001/home/" + _id);
  } catch (error) {
    res.send("Post has not been created!");
  }
});
app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/login.html"));
});
app.post("/login", async function (req, res) {
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
            res.redirect("http://localhost:3001/home/" + userData._id);
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
// Middleware to check if user is authenticated
function authenticateUser(req, res, next) {
  if (req.session && req.session.user) {
    // Assuming session-based authentication
    // User is authenticated, allow access to the route
    next();
  } else {
    // User is not authenticated, redirect to login page or send unauthorized response
    res.status(401).send("Unauthorized");
  }
}
app.post("/delete-account/:id", authenticateUser, async function (req, res) {
  const account_id = req.params.id;
  console.log("User id to delete:", account_id);
  const user = await User.findOneAndDelete({ _id: account_id });
  if (user) {
    res.redirect("http://localhost:3001/");
  } else {
    return res.status(404).send("User not found");
  }
});
app.get("/home/:id/", authenticateUser, async (req, res) => {
  const imagePath = "../backend/views/logo.png";
  var base64Image;
  fs.readFile(imagePath, (err, imageData) => {
    if (err) {
      console.error("Error reading the image file:", err);
      return res.status(500).send("Error reading image");
    }

    // Convert image data to base64 format
    base64Image = Buffer.from(imageData).toString("base64");
  });
  try {
    const id = req.params.id;

    const userData = await User.findOne({ _id: id });
    if (!userData) {
      // Handle scenario when user data is not found
      res.status(404).send("User not found");
      // or render an error page
      // res.render('error.ejs', { errorMessage: 'User not found' });
    } else {
      console.log(id);
      const userPosts = await Post.find({ "author.userId": id });

      console.log(userPosts);
      res.render("home.ejs", { userData, userPosts, image: base64Image });
    }
  } catch (error) {
    // Handle other errors (e.g., database connection errors)
    console.error(error);
    res.status(500).send("Internal Server Error");
    // or render an error page
    // res.render('error.ejs', { errorMessage: 'Internal Server Error' });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send("Logout failed");
    } else {
      res.redirect("/login");
    }
  });
});
app.listen(3001, () => {
  console.log("Listening on the port 3001");
});
