const express = require("express");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const data = require("./data.json");

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
    fileSize: 8000000, // 8 MB limit
  },
});

const sleep = () => new Promise((resolve) => setTimeout(resolve, 600));

// upload single file (jpg/jpeg)
app.post(
  "/api/upload",
  upload.single("image"),
  async (req, res, next) => {
    await sleep();
    if (!req.file) return next(new Error("Missing mandatory file"));
    console.log(req.file);
    res
      .status(200)
      .send(`http://localhost:${PORT}/${req.file.path.replaceAll("\\", "/")}`);
  },
  (error, req, res) => {
    console.error(error.message);
    res.send({ error: error.message });
  }
);

app.get("/api/google", async (req, res) => {
  await sleep();
  console.log(data);
  console.log("query url: " + req.query.url);
  res.json(data);
});

// show index.html
app.use(express.static(__dirname + "/public"));

// Show uploads
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () =>
  console.log(`Server is running -> http://localhost:${PORT}`)
);
