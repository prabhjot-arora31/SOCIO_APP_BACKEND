const Notification = require("../model/notification");
const User = require("../model/users"); // Assuming your user model is named "User"
const router = require("express").Router();
const sizeOf = require("image-size");
const http = require("http"); // Import the HTTP module

// Function to check if a URL is a valid image
async function isImageURL(url) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
  const isImage = imageExtensions.some((ext) =>
    url.toLowerCase().endsWith(ext)
  );
  if (!isImage) {
    return false;
  }

  // Try to fetch image data
  const chunks = [];
  try {
    const imageUrl = url.replace(/^https:\/\//i, "http://");
    const response = await new Promise((resolve, reject) => {
      http.get(imageUrl, resolve).on("error", reject);
    });

    response.on("data", (chunk) => chunks.push(chunk));
    const imageData = await new Promise((resolve, reject) => {
      response.on("end", () => resolve(Buffer.concat(chunks)));
      response.on("error", reject);
    });

    const dimensions = sizeOf(imageData);
    return dimensions.width && dimensions.height;
  } catch (error) {
    console.error("Error fetching image:", error);
    return false;
  }
}

// Express route to handle fetching pending connection requests
router.get("/pending-requests", async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.session.user._id,
      status: "Pending",
    })
      .populate("senderId", "name profileImg") // Populate senderId field with the name and profileImg of the sender
      .exec();

    // Check and update the profileImg field with a default image URL if it's not a valid image URL
    for (const notification of notifications) {
      if (notification.senderId.profileImg) {
        const isValidImage = await isImageURL(notification.senderId.profileImg);
        if (!isValidImage) {
          // Replace with a default image URL if the profileImg is not a valid image URL
          notification.senderId.profileImg =
            "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png";
        }
      }
    }

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
