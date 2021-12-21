const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
uuidv4();
const { exec } = require("child_process");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    // exposedHeaders: "Set-Cookie",
  })
);
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const cookie = req.cookies.clearpath;
  if (cookie === undefined) {
    // cookie seems to set only after the folder is created, it will be recognized after the first call to api
    const uuid = uuidv4();
    res.cookie("clearpath", uuid);
    console.log("cookie created successfully");
    res.status(200).send("");
  } else {
    console.log("cookie already exists", cookie);
  }

  next(); // <-- important!
});

// app.set("trust proxy", 1);
// app.use(
//   session({
//     genid: function (req) {
//       console.log("session id created");
//       return uuidv4();
//     },
//     secret: "Shsh!Secret!",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./frontend/public/files/"); // './public/files/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.get("/", (req, res) => {
  // console.log(req.sessionID);
  console.log("serving");
  res.send("");
});

app.post("/api/uploadForm", upload.single("myFile"), (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
  } else {
    const int = req.body.integer;
    const str = req.body.string;
    const cookie = req.cookies.clearpath;
    const folderName = "./frontend/public/" + cookie + "/";
    const fileName = req.file.filename;
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
      fs.moveSync("./frontend/public/files/" + fileName, folderName + fileName);
      fs.copyFile("./frontend/public/script.sh", folderName + "script.sh");

      exec(`${folderName}script`, [int, str], (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (err) {
          console.log(`error: ${err.message}`);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  console.log("file has been saved");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serving at http://localhost:${port}`);
});
