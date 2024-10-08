const router = require("express").Router();
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send("Logout failed");
    } else {
      res.redirect("https://socio-app-backend-nine.vercel.app/index.html");
    }
  });
});
module.exports = router;
