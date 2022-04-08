const express = require("express");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 5001;

/* 
    npm install -> npm start

    URL: http://localhost:5001/api/upload
    ANDROID STUDIO URL: http://10.0.2.2:5001/api/upload
*/

// saves images on disc
var storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    //Appending .jpg
    cb(null, `${Date.now()}.jpg`),
});

const upload = multer({
  storage,
  preservePath: false,
  limits: {
    fileSize: 1000000, // 1 MB limit
  },
});

// upload single file (jpg/jpeg)
app.post(
  "/api/upload",
  upload.single("image"),
  (req, res, next) => {
    if (!req.file) return next(new Error("Missing mandatory file"));
    console.log(req.file);
    res
      .status(200)
      .send(`http://localhost:${PORT}/${req.file.path.replaceAll("\\", "/")}`);
  },
  (error, req, res) => {
    console.error(error.message);
    res.status(400).send({ error: error.message });
  }
);

// show index.html
app.use(express.static(__dirname + "/public"));

// Show uploads
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () =>
  console.log(`Server is running -> http://localhost:${PORT}`)
);
